import '@testing-library/jest-dom';
import React from 'react';

// Global framer-motion mock - handles ANY motion.* component via Proxy
const motionHandler = {
  get: (target, prop) => {
    if (prop === 'div' || prop === 'h1' || prop === 'h2' || prop === 'h3' ||
        prop === 'p' || prop === 'span' || prop === 'a' || prop === 'ul' ||
        prop === 'li' || prop === 'footer' || prop === 'button' || prop === 'img' ||
        prop === 'svg' || prop === 'circle' || prop === 'rect' || prop === 'line' ||
        prop === 'polyline' || prop === 'path' || prop === 'nav' || prop === 'section' ||
        prop === 'header') {
      const Comp = ({ children, ...props }) => {
        const safeProps = {};
        const reactAttrs = ['className', 'id', 'style', 'href', 'src', 'alt',
          'target', 'rel', 'title', 'onClick', 'onMouseEnter', 'onMouseLeave',
          'key', 'ref', 'width', 'height', 'fill', 'viewBox', 'stroke',
          'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'd', 'cx', 'cy', 'r',
          'xmlns', 'rx', 'ry', 'x', 'y', 'role', 'aria-label', 'aria-labelledby',
          'download', 'type', 'name', 'value', 'placeholder', 'required',
          'onChange', 'onSubmit', 'disabled', 'checked', 'rows', 'cols'];
        Object.entries(props).forEach(([k, v]) => {
          if (reactAttrs.includes(k) || k.startsWith('data-') || k.startsWith('aria-')) {
            safeProps[k] = v;
          }
        });
        return React.createElement(prop, safeProps, children);
      };
      Comp.displayName = `motion.${prop}`;
      return Comp;
    }
    // Default: return a div
    const Comp = ({ children, ...props }) => React.createElement('div', props, children);
    Comp.displayName = `motion.${prop}`;
    return Comp;
  }
};

global.mockMotion = new Proxy({}, motionHandler);

jest.mock("framer-motion", () => ({
  motion: global.mockMotion,
  AnimatePresence: ({ children }) => <>{children}</>,
  useInView: () => true,
}));
