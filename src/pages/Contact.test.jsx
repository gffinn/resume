import React from 'react';
import { render, screen } from '@testing-library/react';
import Contact from './Contact';
import { useContact } from '../hooks/useContact';

// Mock the useContact hook
jest.mock('../hooks/useContact');

// Mock framer-motion
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
      form: React.forwardRef(({ children, ...props }, ref) => (
        <form ref={ref} {...filterProps(props)}>{children}</form>
      )),
      h2: React.forwardRef(({ children, ...props }, ref) => (
        <h2 ref={ref} {...filterProps(props)}>{children}</h2>
      )),
      button: React.forwardRef(({ children, ...props }, ref) => (
        <button ref={ref} {...filterProps(props)}>{children}</button>
      )),
    },
  };
});

describe('Contact Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useContact.mockReturnValue({
      sendMessage: jest.fn(),
      isSubmitting: false,
      error: null,
      success: false,
      reset: jest.fn(),
    });
  });

  const renderContact = () => {
    return render(<Contact />);
  };

  it('should render without crashing', () => {
    renderContact();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render NavBar component', () => {
    renderContact();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render ContactForm component', () => {
    renderContact();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should display all form fields', () => {
    renderContact();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should have submit button', () => {
    renderContact();

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should have proper page structure', () => {
    const { container } = renderContact();

    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('should display all navigation elements', () => {
    renderContact();

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should show loading state when submitting', () => {
    useContact.mockReturnValue({
      sendMessage: jest.fn(),
      isSubmitting: true,
      error: null,
      success: false,
      reset: jest.fn(),
    });

    renderContact();

    expect(screen.getByText(/sending/i)).toBeInTheDocument();
  });

  it('should show success message when form is submitted successfully', () => {
    useContact.mockReturnValue({
      sendMessage: jest.fn(),
      isSubmitting: false,
      error: null,
      success: true,
      reset: jest.fn(),
    });

    renderContact();

    expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
  });

  it('should show error message when submission fails', () => {
    useContact.mockReturnValue({
      sendMessage: jest.fn(),
      isSubmitting: false,
      error: 'Network error',
      success: false,
      reset: jest.fn(),
    });

    renderContact();

    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = renderContact();
    expect(container).toMatchSnapshot();
  });
});
