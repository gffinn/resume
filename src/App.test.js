import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // Check if the main headers are rendered (multiple instances due to all routes rendering)
  const headerElements = screen.getAllByText(/Grant F. Finn/i);
  expect(headerElements.length).toBeGreaterThan(0);
  expect(headerElements[0]).toBeInTheDocument();
});
