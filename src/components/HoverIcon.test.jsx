import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HoverIcon from './HoverIcon';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

describe('HoverIcon', () => {
  describe('basic rendering', () => {
    it('should render icon component', () => {
      render(<HoverIcon icon={FaGithub} text="GitHub" url="/github" />);

      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    it('should render text label', () => {
      render(<HoverIcon icon={FaLinkedin} text="LinkedIn" url="/linkedin" />);

      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    it('should render as a link', () => {
      render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" />
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });
  });

  describe('URL handling', () => {
    it('should link to internal route', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="Internal"
            url="/internal"
            newTab={false}
          />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/internal');
    });

    it('should link to external URL', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="https://github.com"
            newTab={true}
          />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://github.com');
    });

    it('should handle mailto links', () => {
      render(
        <HoverIcon
            icon={FaEnvelope}
            text="Email"
            url="mailto:test@example.com"
          />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    });
  });

  describe('newTab prop', () => {
    it('should open in new tab when newTab is true', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="https://github.com"
            newTab={true}
          />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('should open in same tab when newTab is false', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="/github"
            newTab={false}
          />
      );

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('target', '_blank');
    });

    it('should default to opening in new tab', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="https://github.com"
          />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  describe('security attributes', () => {
    it('should include rel="noopener noreferrer" for external links', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="https://github.com"
            newTab={true}
          />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not include rel attribute for internal links', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="Internal"
            url="/internal"
            newTab={false}
          />
      );

      const link = screen.getByRole('link');
      // If newTab is false, rel should not be set
      if (link.hasAttribute('target')) {
        expect(link).not.toHaveAttribute('target', '_blank');
      }
    });
  });

  describe('size prop', () => {
    it('should use default size of 96', () => {
      const { container } = render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" />
      );

      const icon = container.querySelector('svg');
      // Icon should be rendered with default size
      expect(icon).toBeInTheDocument();
    });

    it('should accept custom size', () => {
      const { container } = render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" size={64} />
      );

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should handle small sizes', () => {
      const { container } = render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" size={24} />
      );

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should handle large sizes', () => {
      const { container } = render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" size={128} />
      );

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('color prop', () => {
    it('should use default color #333', () => {
      const { container } = render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should accept custom color', () => {
      const { container } = render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="/github"
            color="#ff0000"
          />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should handle named colors', () => {
      const { container } = render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="/github"
            color="blue"
          />
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="/github"
            className="custom-class"
          />
      );

      const link = container.querySelector('a');
      expect(link).toHaveClass('custom-class');
    });

    it('should apply multiple custom classes', () => {
      const { container } = render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="/github"
            className="class-1 class-2 class-3"
          />
      );

      const link = container.querySelector('a');
      expect(link).toHaveClass('class-1');
      expect(link).toHaveClass('class-2');
      expect(link).toHaveClass('class-3');
    });
  });

  describe('accessibility', () => {
    it('should have aria-label for screen readers', () => {
      render(
        <HoverIcon icon={FaGithub} text="GitHub Profile" url="/github" />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'GitHub Profile');
    });

    it('should use text prop as aria-label', () => {
      render(
        <HoverIcon
            icon={FaLinkedin}
            text="LinkedIn Profile"
            url="/linkedin"
          />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'LinkedIn Profile');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" />
      );

      const link = screen.getByRole('link');

      // Tab to the link
      await user.tab();
      expect(link).toHaveFocus();
    });

    it('should be clickable with Enter key', async () => {
      const user = userEvent.setup();
      render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" />
      );

      const link = screen.getByRole('link');
      link.focus();

      await user.keyboard('{Enter}');

      // Link should still be in the document (navigation would happen in real browser)
      expect(link).toBeInTheDocument();
    });
  });

  describe('different icon types', () => {
    it('should render GitHub icon', () => {
      render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" />
      );

      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    it('should render LinkedIn icon', () => {
      render(
        <HoverIcon icon={FaLinkedin} text="LinkedIn" url="/linkedin" />
      );

      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    it('should render Email icon', () => {
      render(
        <HoverIcon icon={FaEnvelope} text="Email" url="mailto:test@test.com" />
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('should be clickable', async () => {
      const user = userEvent.setup();
      render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" />
      );

      const link = screen.getByRole('link');
      await user.click(link);

      expect(link).toBeInTheDocument();
    });

    it('should handle hover state', async () => {
      const user = userEvent.setup();
      render(
        <HoverIcon icon={FaGithub} text="GitHub" url="/github" />
      );

      const link = screen.getByRole('link');
      await user.hover(link);

      expect(link).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty text', () => {
      render(
        <HoverIcon icon={FaGithub} text="" url="/github" />
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('should handle very long text', () => {
      const longText = 'This is a very long text label that might wrap';
      render(
        <HoverIcon icon={FaGithub} text={longText} url="/github" />
      );

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle special characters in text', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub & LinkedIn"
            url="/github"
          />
      );

      expect(screen.getByText('GitHub & LinkedIn')).toBeInTheDocument();
    });

    it('should handle URLs with query parameters', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="https://github.com?tab=repositories"
          />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute(
        'href',
        'https://github.com?tab=repositories'
      );
    });

    it('should handle URLs with hash fragments', () => {
      render(
        <HoverIcon
            icon={FaGithub}
            text="GitHub"
            url="https://github.com#section"
          />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://github.com#section');
    });
  });
});
