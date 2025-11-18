import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Timeline from './Timeline';
import { fetchTimelineData } from '../api/timelineApi';

// Mock the timeline API
jest.mock('../api/timelineApi');

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react');

  // Helper to filter out framer-motion specific props
  const filterProps = (props) => {
    const {
      initial,
      animate,
      exit,
      whileInView,
      whileHover,
      whileTap,
      whileFocus,
      whileDrag,
      viewport,
      transition,
      variants,
      ...domProps
    } = props;
    return domProps;
  };

  return {
    motion: {
      div: React.forwardRef(({ children, ...props }, ref) => (
        <div ref={ref} {...filterProps(props)}>{children}</div>
      )),
      ul: React.forwardRef(({ children, ...props }, ref) => (
        <ul ref={ref} {...filterProps(props)}>{children}</ul>
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
    stack: ['React', 'Node.js', 'TypeScript'],
    summary: 'This is a test summary',
    details: [
      'Detail 1: First achievement',
      'Detail 2: Second achievement',
    ],
  },
  {
    id: 2,
    company: 'Another Company',
    logo: '/logo2.png',
    role: 'Junior Developer',
    dates: '2021 - 2023',
    stack: ['JavaScript', 'HTML', 'CSS'],
    summary: 'Another test summary',
    details: ['Detail 1: Learning experience'],
  },
];

describe('Timeline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial render and loading state', () => {
    it('should show loading state initially', () => {
      fetchTimelineData.mockReturnValue(new Promise(() => {})); // Never resolves
      render(<Timeline />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should fetch timeline data on mount', async () => {
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => {
        expect(fetchTimelineData).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('successful data loading', () => {
    it('should display timeline items after successful fetch', async () => {
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => {
        expect(screen.getByText('Test Company')).toBeInTheDocument();
        expect(screen.getByText('Another Company')).toBeInTheDocument();
      });
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Junior Developer')).toBeInTheDocument();
    });

    it('should display company logos', async () => {
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => {
        const logos = screen.getAllByRole('img');
        expect(logos).toHaveLength(2);
        expect(logos[0]).toHaveAttribute('src', '/logo.png');
        expect(logos[1]).toHaveAttribute('src', '/logo2.png');
      });
    });

    it('should display dates for each position', async () => {
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => {
        expect(screen.getByText('2023 - Present')).toBeInTheDocument();
        expect(screen.getByText('2021 - 2023')).toBeInTheDocument();
      });
    });

    it('should display tech stack for each position', async () => {
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => {
        ['React', 'Node.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS'].forEach((tech) => {
          expect(screen.getByText(tech)).toBeInTheDocument();
        });
      });
    });

    it('should display summaries', async () => {
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => {
        expect(screen.getByText('This is a test summary')).toBeInTheDocument();
        expect(screen.getByText('Another test summary')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should display error message when fetch fails', async () => {
      fetchTimelineData.mockRejectedValueOnce(new Error('Failed to load timeline'));
      render(<Timeline />);
      await waitFor(() => {
        expect(screen.getByText(/failed to load timeline/i)).toBeInTheDocument();
      });
    });

    it('should display error for invalid data format', async () => {
      fetchTimelineData.mockResolvedValueOnce([{ id: 1, company: 'Test' }]);
      render(<Timeline />);
      await waitFor(() => {
        expect(screen.getByText(/failed to load timeline data/i)).toBeInTheDocument();
      });
    });

    it('should handle null response', async () => {
      fetchTimelineData.mockResolvedValueOnce(null);
      render(<Timeline />);
      await waitFor(() => {
        expect(screen.getByText(/invalid timeline data|failed to load/i)).toBeInTheDocument();
      });
    });

    it('should handle empty array', async () => {
      fetchTimelineData.mockResolvedValueOnce([]);
      render(<Timeline />);
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      });
    });
  });

  describe('expandable details functionality', () => {
    it('should not show details initially', async () => {
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => {
        expect(screen.getByText('Test Company')).toBeInTheDocument();
      });
      expect(screen.queryByText('Detail 1: First achievement')).not.toBeInTheDocument();
    });

    it('should expand and show details when clicked', async () => {
      const user = userEvent.setup();
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => {
        expect(screen.getByText('Test Company')).toBeInTheDocument();
      });
      const toggleButtons = screen.getAllByRole('button');
      await user.click(toggleButtons[0]);
      await waitFor(() => {
        expect(screen.getByText('Detail 1: First achievement')).toBeInTheDocument();
        expect(screen.getByText('Detail 2: Second achievement')).toBeInTheDocument();
      });
    });

    it('should collapse details when clicked again', async () => {
      const user = userEvent.setup();
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => expect(screen.getByText('Test Company')).toBeInTheDocument());
      const toggleButtons = screen.getAllByRole('button');
      // Expand
      await user.click(toggleButtons[0]);
      await waitFor(() => expect(screen.getByText('Detail 1: First achievement')).toBeInTheDocument());
      // Collapse
      await user.click(toggleButtons[0]);
      await waitFor(() => expect(screen.queryByText('Detail 1: First achievement')).not.toBeInTheDocument());
    });

    it('should collapse previous item when expanding a new one', async () => {
      const user = userEvent.setup();
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => expect(screen.getByText('Test Company')).toBeInTheDocument());
      const toggleButtons = screen.getAllByRole('button');

      // Expand first item
      await user.click(toggleButtons[0]);
      await waitFor(() => expect(screen.getByText('Detail 1: First achievement')).toBeInTheDocument());

      // Expand second item - should collapse the first
      await user.click(toggleButtons[1]);
      await waitFor(() => expect(screen.getByText('Detail 1: Learning experience')).toBeInTheDocument());

      // First item should now be collapsed
      expect(screen.queryByText('Detail 1: First achievement')).not.toBeInTheDocument();
      expect(screen.getByText('Detail 1: Learning experience')).toBeInTheDocument();
    });
  });

  describe('data validation', () => {
    it('should validate required fields in timeline items', async () => {
      const invalidData = [{ id: 1, company: 'Test Company' }];
      fetchTimelineData.mockResolvedValueOnce(invalidData);
      render(<Timeline />);
      await waitFor(() => expect(screen.getByText(/failed to load timeline data/i)).toBeInTheDocument());
    });

    it('should validate that details is an array', async () => {
      const invalidData = [
        { id: 1, company: 'Test Company', role: 'Developer', dates: '2023', stack: ['React'], summary: 'Test', details: 'Not an array' },
      ];
      fetchTimelineData.mockResolvedValueOnce(invalidData);
      render(<Timeline />);
      await waitFor(() => expect(screen.getByText(/failed to load timeline data/i)).toBeInTheDocument());
    });

    it('should handle items with empty details array', async () => {
      const dataWithEmptyDetails = [
        { id: 1, company: 'Test Company', logo: '/logo.png', role: 'Developer', dates: '2023', stack: ['React'], summary: 'Test summary', details: [] },
      ];
      fetchTimelineData.mockResolvedValueOnce(dataWithEmptyDetails);
      render(<Timeline />);
      await waitFor(() => expect(screen.getByText('Test Company')).toBeInTheDocument());
      expect(screen.getByText('Test summary')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper alt text for logos', async () => {
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => {
        const logos = screen.getAllByRole('img');
        expect(logos[0]).toHaveAttribute('alt', 'Test Company');
        expect(logos[1]).toHaveAttribute('alt', 'Another Company');
      });
    });

    it('buttons are keyboard accessible', async () => {
      const user = userEvent.setup();
      fetchTimelineData.mockResolvedValueOnce(mockTimelineData);
      render(<Timeline />);
      await waitFor(() => expect(screen.getByText('Test Company')).toBeInTheDocument());

      const toggleButton = screen.getAllByRole('button')[0];

      // Tab to focus and press Enter to expand
      toggleButton.focus();
      await user.keyboard('{Enter}');
      await waitFor(() => expect(screen.getByText('Detail 1: First achievement')).toBeInTheDocument());

      // Press Enter again to collapse
      await user.keyboard('{Enter}');
      await waitFor(() => expect(screen.queryByText('Detail 1: First achievement')).not.toBeInTheDocument());
    });
  });
});
