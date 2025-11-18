// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock framer-motion globally
jest.mock('framer-motion', () => {
  const React = require('react');

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
      h1: React.forwardRef(({ children, ...props }, ref) => (
        <h1 ref={ref} {...filterProps(props)}>{children}</h1>
      )),
      h2: React.forwardRef(({ children, ...props }, ref) => (
        <h2 ref={ref} {...filterProps(props)}>{children}</h2>
      )),
      p: React.forwardRef(({ children, ...props }, ref) => (
        <p ref={ref} {...filterProps(props)}>{children}</p>
      )),
      button: React.forwardRef(({ children, ...props }, ref) => (
        <button ref={ref} {...filterProps(props)}>{children}</button>
      )),
      ul: React.forwardRef(({ children, ...props }, ref) => (
        <ul ref={ref} {...filterProps(props)}>{children}</ul>
      )),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
