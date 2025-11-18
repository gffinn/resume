const React = require('react');

module.exports = {
  BrowserRouter: ({ children }) => React.createElement('div', null, children),
  MemoryRouter: ({ children }) => React.createElement('div', null, children),
  Link: ({ children, to, ...props }) => {
    const handleClick = (e) => {
      e.preventDefault();
      if (props.onClick) props.onClick(e);
    };
    return React.createElement(
      'a',
      { href: to, onClick: handleClick, ...props },
      children
    );
  },
  NavLink: ({ children, to, className, ...props }) => {
    const computedClassName =
      typeof className === 'function'
        ? className({ isActive: false })
        : className;
    const handleClick = (e) => {
      e.preventDefault();
      if (props.onClick) props.onClick(e);
    };
    return React.createElement(
      'a',
      {
        href: to,
        className: computedClassName,
        onClick: handleClick,
        ...props,
      },
      children
    );
  },
  Routes: ({ children }) => React.createElement('div', null, children),
  Route: ({ element }) => element,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({}),
};
