import { render, screen } from '@testing-library/react';
import ResumeHeader from './ResumeHeader';

describe('ResumeHeader', () => {
  it('should render the name "Grant F. Finn"', () => {
    render(<ResumeHeader />);

    expect(screen.getByText('Grant F. Finn')).toBeInTheDocument();
  });

  it('should render as a heading element', () => {
    render(<ResumeHeader />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Grant F. Finn');
  });

  it('should apply animation class', () => {
    const { container } = render(<ResumeHeader />);

    const header = container.querySelector('h1');
    expect(header).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<ResumeHeader />);
    expect(container).toMatchSnapshot();
  });
});
