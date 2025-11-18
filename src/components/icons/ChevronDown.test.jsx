import React from 'react';
import { render } from '@testing-library/react';
import ChevronDown from './ChevronDown';

describe('ChevronDown', () => {
  it('should render SVG element', () => {
    const { container } = render(<ChevronDown />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have default size of 24', () => {
    const { container } = render(<ChevronDown />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('should accept custom size prop', () => {
    const { container } = render(<ChevronDown size={32} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('should apply custom className', () => {
    const { container } = render(<ChevronDown className="custom-class" />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('should apply multiple classes', () => {
    const { container } = render(
      <ChevronDown className="class-1 class-2" />
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('class-1');
    expect(svg).toHaveClass('class-2');
  });

  it('should have aria-hidden attribute', () => {
    const { container } = render(<ChevronDown />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('should have focusable set to false', () => {
    const { container } = render(<ChevronDown />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('should have viewBox attribute', () => {
    const { container } = render(<ChevronDown />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox');
  });

  it('should render polyline element', () => {
    const { container } = render(<ChevronDown />);

    const polyline = container.querySelector('polyline');
    expect(polyline).toBeInTheDocument();
  });

  it('should handle size 0', () => {
    const { container } = render(<ChevronDown size={0} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '0');
    expect(svg).toHaveAttribute('height', '0');
  });

  it('should handle large size values', () => {
    const { container } = render(<ChevronDown size={256} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '256');
    expect(svg).toHaveAttribute('height', '256');
  });

  it('should maintain aspect ratio', () => {
    const { container } = render(<ChevronDown size={48} />);

    const svg = container.querySelector('svg');
    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');

    expect(width).toBe(height);
  });

  it('should be usable as decorative icon', () => {
    const { container } = render(<ChevronDown />);

    const svg = container.querySelector('svg');
    // aria-hidden and focusable=false make it decorative
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('should match snapshot with default props', () => {
    const { container } = render(<ChevronDown />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with custom props', () => {
    const { container } = render(
      <ChevronDown size={32} className="custom-chevron" />
    );
    expect(container).toMatchSnapshot();
  });
});
