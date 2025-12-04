const express = require("express");
  const path = require("path");
  const { createProxyMiddleware } = require("http-proxy-middleware");
  const app = express();

  const PORT = process.env.PORT || 8080;
  const BACKEND_URL = process.env.BACKEND_URL ||
  "https://resumedemobls-a7cja7bchqc7a8em.chilecentral-01.azurewebsites.net";

  // Proxy API requests to the Azure backend
  app.use("/api", createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    logLevel: "debug"
  }));

  // Serve React build folder
  app.use(express.static(path.join(__dirname, "build")));

  // Handle React routing, serve index.html for all other requests
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));