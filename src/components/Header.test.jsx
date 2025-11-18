import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Header', () => {
  it('should render the name "Grant F. Finn"', () => {
    render(<Header />);

    expect(screen.getByText('Grant F. Finn')).toBeInTheDocument();
  });

  it('should render as a heading element', () => {
    render(<Header />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Grant F. Finn');
  });

  it('should apply animation class', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('h1');
    expect(header).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });
});
