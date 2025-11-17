# Backend Security Implementation Guide

## Honeypot Field & IP Blocking

This document describes how to implement bot detection and IP blocking in your .NET Azure backend.

## Overview

The frontend now includes a honeypot field (`website`) that legitimate users won't see or fill out. Bots and AI typically fill out all fields, so if this field has a value, it's likely a bot.

## Frontend Implementation (Already Done)

- Hidden field `website` added to contact form
- Field is hidden using CSS (`position: absolute; left: -9999px; opacity: 0`)
- Client-side validation rejects submissions if honeypot field is filled
- Field is sent to backend with all form data

## Required Backend Changes

### 1. Update Contact Model

Add the honeypot field to your C# model:

```csharp
public class ContactRequest
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Subject { get; set; }
    public string Message { get; set; }
    public DateTime CreatedAt { get; set; }

    // Honeypot field - should always be empty for legitimate requests
    public string Website { get; set; }
}
```

### 2. Create IP Blocking Service

Create a service to track and block malicious IPs:

```csharp
// Services/IpBlockingService.cs
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Concurrent;

public interface IIpBlockingService
{
    bool IsBlocked(string ipAddress);
    void BlockIp(string ipAddress, string reason);
    void RecordFailedAttempt(string ipAddress);
}

public class IpBlockingService : IIpBlockingService
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<IpBlockingService> _logger;
    private readonly ConcurrentDictionary<string, int> _failedAttempts;

    // Configuration
    private const int MAX_FAILED_ATTEMPTS = 3;
    private const int BLOCK_DURATION_MINUTES = 60;
    private const int ATTEMPT_WINDOW_MINUTES = 10;

    public IpBlockingService(IMemoryCache cache, ILogger<IpBlockingService> logger)
    {
        _cache = cache;
        _logger = logger;
        _failedAttempts = new ConcurrentDictionary<string, int>();
    }

    public bool IsBlocked(string ipAddress)
    {
        return _cache.TryGetValue($"blocked_{ipAddress}", out _);
    }

    public void BlockIp(string ipAddress, string reason)
    {
        var expirationTime = DateTimeOffset.Now.AddMinutes(BLOCK_DURATION_MINUTES);
        _cache.Set($"blocked_{ipAddress}", reason, expirationTime);

        _logger.LogWarning(
            "IP {IpAddress} blocked for {Duration} minutes. Reason: {Reason}",
            ipAddress,
            BLOCK_DURATION_MINUTES,
            reason
        );
    }

    public void RecordFailedAttempt(string ipAddress)
    {
        var attempts = _failedAttempts.AddOrUpdate(
            ipAddress,
            1,
            (key, oldValue) => oldValue + 1
        );

        if (attempts >= MAX_FAILED_ATTEMPTS)
        {
            BlockIp(ipAddress, $"Exceeded {MAX_FAILED_ATTEMPTS} failed attempts");
            _failedAttempts.TryRemove(ipAddress, out _);
        }
        else
        {
            // Clear failed attempts after window expires
            Task.Delay(TimeSpan.FromMinutes(ATTEMPT_WINDOW_MINUTES))
                .ContinueWith(_ => _failedAttempts.TryRemove(ipAddress, out _));
        }
    }
}
```

### 3. Register Service in Program.cs

```csharp
// Program.cs
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<IIpBlockingService, IpBlockingService>();
```

### 4. Update Contact Controller

Implement honeypot validation and IP blocking:

```csharp
// Controllers/ContactController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IIpBlockingService _ipBlockingService;
    private readonly ILogger<ContactController> _logger;
    private readonly IContactRepository _contactRepository; // Your existing repository

    public ContactController(
        IIpBlockingService ipBlockingService,
        ILogger<ContactController> logger,
        IContactRepository contactRepository)
    {
        _ipBlockingService = ipBlockingService;
        _logger = logger;
        _contactRepository = contactRepository;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitContact([FromBody] ContactRequest request)
    {
        // Get client IP address
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

        if (string.IsNullOrEmpty(ipAddress))
        {
            _logger.LogWarning("Could not determine client IP address");
            return BadRequest(new { error = "Invalid request" });
        }

        // Check if IP is blocked
        if (_ipBlockingService.IsBlocked(ipAddress))
        {
            _logger.LogWarning("Blocked IP {IpAddress} attempted to submit contact form", ipAddress);
            return StatusCode(429, new { error = "Too many requests. Please try again later." });
        }

        // Validate honeypot field
        if (!string.IsNullOrEmpty(request.Website))
        {
            _logger.LogWarning(
                "Bot detected via honeypot field from IP {IpAddress}. Website field value: {Value}",
                ipAddress,
                request.Website
            );

            // Block the IP immediately
            _ipBlockingService.BlockIp(ipAddress, "Honeypot field filled (bot detected)");

            // Return success to bot so it doesn't retry
            return Ok(new { success = true, message = "Message received" });
        }

        // Additional validation
        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Message))
        {
            _ipBlockingService.RecordFailedAttempt(ipAddress);
            return BadRequest(new { error = "All fields are required" });
        }

        // Validate email format
        if (!IsValidEmail(request.Email))
        {
            _ipBlockingService.RecordFailedAttempt(ipAddress);
            return BadRequest(new { error = "Invalid email format" });
        }

        // Sanitize inputs (prevent XSS and SQL injection)
        request.Name = SanitizeInput(request.Name);
        request.Email = SanitizeInput(request.Email);
        request.Subject = SanitizeInput(request.Subject);
        request.Message = SanitizeInput(request.Message);

        try
        {
            // Save to database
            await _contactRepository.AddAsync(request);

            _logger.LogInformation(
                "Contact form submitted successfully from IP {IpAddress}, Email: {Email}",
                ipAddress,
                request.Email
            );

            return Ok(new { success = true, message = "Message sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing contact form from IP {IpAddress}", ipAddress);
            return StatusCode(500, new { error = "An error occurred processing your request" });
        }
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private string SanitizeInput(string input)
    {
        if (string.IsNullOrEmpty(input)) return input;

        // Remove potentially dangerous characters
        return System.Net.WebUtility.HtmlEncode(input.Trim());
    }
}
```

### 5. Optional: Add IP Blocking Middleware

For global protection, create middleware:

```csharp
// Middleware/IpBlockingMiddleware.cs
public class IpBlockingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IIpBlockingService _ipBlockingService;

    public IpBlockingMiddleware(RequestDelegate next, IIpBlockingService ipBlockingService)
    {
        _next = next;
        _ipBlockingService = ipBlockingService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var ipAddress = context.Connection.RemoteIpAddress?.ToString();

        if (!string.IsNullOrEmpty(ipAddress) && _ipBlockingService.IsBlocked(ipAddress))
        {
            context.Response.StatusCode = 429; // Too Many Requests
            await context.Response.WriteAsync("Too many requests. Please try again later.");
            return;
        }

        await _next(context);
    }
}

// In Program.cs, add before routing:
app.UseMiddleware<IpBlockingMiddleware>();
```

### 6. Optional: Persistent IP Blocking with Database

For production, store blocked IPs in your Postgres database:

```csharp
// Models/BlockedIp.cs
public class BlockedIp
{
    public int Id { get; set; }
    public string IpAddress { get; set; }
    public string Reason { get; set; }
    public DateTime BlockedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsPermanent { get; set; }
}

// Add to DbContext
public DbSet<BlockedIp> BlockedIps { get; set; }
```

Update the service to check database:

```csharp
public async Task<bool> IsBlockedAsync(string ipAddress)
{
    // Check memory cache first (fast)
    if (_cache.TryGetValue($"blocked_{ipAddress}", out _))
        return true;

    // Check database (slower but persistent)
    var blocked = await _dbContext.BlockedIps
        .AnyAsync(b => b.IpAddress == ipAddress &&
                      (b.IsPermanent || b.ExpiresAt > DateTime.UtcNow));

    if (blocked)
    {
        // Cache the result
        _cache.Set($"blocked_{ipAddress}", true, TimeSpan.FromMinutes(60));
    }

    return blocked;
}
```

## Testing the Implementation

### Test Honeypot Detection

```bash
# This should be blocked
curl -X POST https://your-api.azurewebsites.net/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bot User",
    "email": "bot@example.com",
    "subject": "Test",
    "message": "Test message",
    "website": "http://spam.com",
    "createdAt": "2025-01-01T00:00:00Z"
  }'
```

### Test Legitimate Request

```bash
# This should succeed
curl -X POST https://your-api.azurewebsites.net/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Real User",
    "email": "user@example.com",
    "subject": "Question",
    "message": "I have a question about your services",
    "website": "",
    "createdAt": "2025-01-01T00:00:00Z"
  }'
```

## Monitoring & Analytics

Add logging to track:
- Number of blocked IPs
- Honeypot detections
- Failed validation attempts
- Geographic location of blocked IPs (using IP geolocation service)

Consider using Azure Application Insights for monitoring:

```csharp
// Track custom metrics
_telemetryClient.TrackMetric("BotDetected", 1);
_telemetryClient.TrackEvent("IpBlocked", new Dictionary<string, string>
{
    { "IpAddress", ipAddress },
    { "Reason", reason }
});
```

## Security Best Practices

1. **Never reveal blocking logic to clients** - Always return generic success messages
2. **Log all suspicious activity** - For security auditing
3. **Rotate block lists periodically** - Remove old blocks to prevent permanent lockouts
4. **Whitelist known IPs** - If you have trusted sources (e.g., your own testing IPs)
5. **Rate limiting** - Add general rate limiting (e.g., 10 requests per minute per IP)
6. **CAPTCHA as fallback** - Consider adding reCAPTCHA v3 for additional protection

## Additional Recommendations

1. **Add Rate Limiting**: Use `AspNetCoreRateLimit` NuGet package
2. **Email validation**: Consider using a service like Kickbox or ZeroBounce to validate email addresses
3. **Content filtering**: Check message content for spam patterns
4. **Time-based checks**: Reject submissions that happen too quickly (< 3 seconds)
5. **Require HTTPS**: Ensure all API calls use HTTPS only
