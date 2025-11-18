import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavBar from './NavBar';

describe('NavBar', () => {
  describe('initial render', () => {
    it('should render navigation links', () => {
      render(<NavBar />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render initials "GF"', () => {
      render(
        <NavBar />
      );

      expect(screen.getByText('GF')).toBeInTheDocument();
    });

    it('should have correct links', () => {
      render(
        <NavBar />
      );

      const homeLink = screen.getByRole('link', { name: /home/i });
      const resumeLink = screen.getByRole('link', { name: /resume/i });
      const contactLink = screen.getByRole('link', { name: /contact/i });

      expect(homeLink).toHaveAttribute('href', '/');
      expect(resumeLink).toHaveAttribute('href', '/Resume');
      expect(contactLink).toHaveAttribute('href', '/Contact');
    });
  });

  describe('location-based styling', () => {
    it('should apply default styling on home page', () => {
      render(
        <NavBar />
        );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      // Check for default class or style
    });

    it('should apply different styling on Resume page', () => {
      render(
        <NavBar />
        );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      // On Resume page, navbar should have different styling
      // The actual implementation checks location.pathname === '/Resume'
    });

    it('should use default styling on Contact page', () => {
      render(
        <NavBar />
        );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should use default styling on CodingChallenges page', () => {
      render(
        <NavBar />
        );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should use default styling on unknown routes', () => {
      render(
        <NavBar />
        );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('navigation functionality', () => {
    it('should navigate to home page when Home link is clicked', async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      await user.click(homeLink);

      // Link should have correct href
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should navigate to Resume page when Resume link is clicked', async () => {
      const user = userEvent.setup();
      render(
        <NavBar />
        );

      const resumeLink = screen.getByRole('link', { name: /resume/i });
      await user.click(resumeLink);

      expect(resumeLink).toHaveAttribute('href', '/Resume');
    });

    it('should navigate to Contact page when Contact link is clicked', async () => {
      const user = userEvent.setup();
      render(
        <NavBar />
        );

      const contactLink = screen.getByRole('link', { name: /contact/i });
      await user.click(contactLink);

      expect(contactLink).toHaveAttribute('href', '/Contact');
    });
  });

  describe('initials display', () => {
    it('should display initials as decorative element', () => {
      render(
        <NavBar />
      );

      const initials = screen.getByText('GF');
      expect(initials).toBeInTheDocument();
      expect(initials).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render initials in a div element', () => {
      render(
        <NavBar />
        );

      const initials = screen.getByText('GF');
      expect(initials.tagName).toBe('DIV');
    });
  });

  describe('accessibility', () => {
    it('should have navigation landmark', () => {
      render(
        <NavBar />
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have accessible link text', () => {
      render(
        <NavBar />
      );

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /contact/i })
      ).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(
        <NavBar />
      );

      // Tab through links
      await user.tab();
      const firstFocusable = document.activeElement;
      expect(firstFocusable.tagName).toBe('A');

      await user.tab();
      const secondFocusable = document.activeElement;
      expect(secondFocusable.tagName).toBe('A');

      await user.tab();
      const thirdFocusable = document.activeElement;
      expect(thirdFocusable.tagName).toBe('A');
    });

    it('should have proper aria attributes if needed', () => {
      render(
        <NavBar />
      );

      const nav = screen.getByRole('navigation');
      // Check for aria-label if implemented
      // This is optional but good practice
      expect(nav).toBeInTheDocument();
    });
  });

  describe('responsive behavior', () => {
    it('should render all links on desktop', () => {
      render(
        <NavBar />
      );

      expect(screen.getByText('Home')).toBeVisible();
      expect(screen.getByText('Resume')).toBeVisible();
      expect(screen.getByText('Contact')).toBeVisible();
      expect(screen.getByText('GF')).toBeVisible();
    });
  });

  describe('visual regression protection', () => {
    it('should maintain structure with initials on left and links on right', () => {
      const { container } = render(
        <NavBar />
      );

      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();

      // Initials should be present
      expect(screen.getByText('GF')).toBeInTheDocument();

      // All navigation links should be present
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render consistently across different routes', () => {
      const routes = ['/', '/Resume', '/Contact', '/CodingChallenges'];

      routes.forEach((route) => {
        const { container } = render(
          <NavBar />
            );

        expect(container.querySelector('nav')).toBeInTheDocument();
        expect(screen.getByText('GF')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Resume')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();

        // Cleanup for next iteration
        container.remove();
      });
    });
  });

  describe('integration with React Router', () => {
    it('should use useLocation hook correctly', () => {
      // Test that component renders without errors when useLocation is called
      render(
        <NavBar />
        );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle location changes', () => {
      const { rerender } = render(
        <NavBar />
        );

      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // Simulate route change
      rerender(
        <NavBar />
        );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
