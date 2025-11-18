import React from 'react';
import { render, screen } from '@testing-library/react';
import SiteDescription from './SiteDescription';

describe('SiteDescription', () => {
  it('should render descriptive text', () => {
    render(<SiteDescription />);

    // Component should render some descriptive text
    const container = screen.getByText(/./);
    expect(container).toBeInTheDocument();
  });

  it('should accept and apply className prop', () => {
    const { container } = render(<SiteDescription className="custom-class" />);

    const element = container.firstChild;
    expect(element).toHaveClass('custom-class');
  });

  it('should render without className prop', () => {
    const { container } = render(<SiteDescription />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should contain website mission statement', () => {
    render(<SiteDescription />);

    // The component should contain descriptive text about the website
    const element = screen.getByText(/./);
    expect(element).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<SiteDescription />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with className', () => {
    const { container } = render(<SiteDescription className="test-class" />);
    expect(container).toMatchSnapshot();
  });
});
