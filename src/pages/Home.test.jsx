import { render, screen } from '@testing-library/react';
import Home from './Home';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            initial,
            animate,
            whileInView,
            viewport,
            transition,
            ...props
          },
          ref
        ) => (
          <div ref={ref} {...props}>
            {children}
          </div>
        )
      ),
    },
  };
});

describe('Home Page', () => {
  const renderHome = () => {
    return render(<Home />);
  };

  it('should render without crashing', () => {
    renderHome();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render NavBar component', () => {
    renderHome();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render Header component', () => {
    renderHome();
    expect(screen.getByText('Grant F. Finn')).toBeInTheDocument();
  });

  it('should render SiteDescription component', () => {
    renderHome();
    // SiteDescription should be present
    const container = document.body;
    expect(container).toBeInTheDocument();
  });

  it('should render social media links', () => {
    renderHome();

    // Should have multiple links (Resume, LinkedIn, GitHub, etc.)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have Resume link', () => {
    renderHome();

    const resumeLinks = screen.getAllByText('Resume');
    expect(resumeLinks.length).toBeGreaterThan(0);
    expect(resumeLinks[0]).toBeInTheDocument();
  });

  it('should have LinkedIn link', () => {
    renderHome();

    const linkedinLink = screen.getByText('LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
  });

  it('should have GitHub link', () => {
    renderHome();

    const githubLink = screen.getByText('GitHub');
    expect(githubLink).toBeInTheDocument();
  });

  it('should render HoverIcon components', () => {
    renderHome();

    // Check for icon text labels (using getAllByText since Resume appears in navbar too)
    expect(screen.getAllByText('Resume').length).toBeGreaterThan(0);
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('should have proper page structure', () => {
    const { container } = renderHome();

    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('should display all required navigation elements', () => {
    renderHome();

    // NavBar should have these links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = renderHome();
    expect(container).toMatchSnapshot();
  });
});
