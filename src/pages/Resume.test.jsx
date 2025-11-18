import { render, screen, waitFor } from '@testing-library/react';
import Resume from './Resume';
import { fetchTimelineData } from '../api/timelineApi';

// Mock the timeline API
jest.mock('../api/timelineApi');

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, initial, animate, whileInView, viewport, transition, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      )),
      ul: React.forwardRef(({ children, initial, animate, whileInView, viewport, transition, ...props }, ref) => (
        <ul ref={ref} {...props}>{children}</ul>
      )),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

const mockTimelineData = [
  {
    id: 1,
    company: 'Test Company',
    logo: '/logo.png',
    role: 'Software Engineer',
    dates: '2023 - Present',
    stack: ['React', 'Node.js'],
    summary: 'Test summary',
    details: ['Detail 1', 'Detail 2'],
  },
];

describe('Resume Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderResume = () => {
    return render(<Resume />);
  };

  it('should render without crashing', () => {
    fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
    renderResume();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render NavBar component', () => {
    fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
    renderResume();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render ResumeHeader component', () => {
    fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
    renderResume();
    expect(screen.getByText('Grant F. Finn')).toBeInTheDocument();
  });

  it('should render Timeline component', async () => {
    fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
    renderResume();

    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
  });

  it('should display timeline data after loading', async () => {
    fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
    renderResume();

    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    fetchTimelineData.mockReturnValue(new Promise(() => {})); // Never resolves
    renderResume();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should have proper page structure', () => {
    fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
    const { container } = renderResume();

    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('should display all navigation elements', () => {
    fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
    renderResume();

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should match snapshot when loaded', async () => {
    fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
    const { container } = renderResume();

    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
