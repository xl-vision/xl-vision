import PropTypes from 'prop-types';
import clsx from 'clsx';
import React from 'react';
import './prism-light.scss';
import './prism-dark.scss';

export type WrapperProps = {
  children: React.ReactNode;
  name: string;
};

const Wrapper: React.FunctionComponent<WrapperProps> = (props) => {
  const { children, name } = props;

  const [isDark, setDark] = React.useState(false);

  React.useEffect(() => {
    const { title } = document;
    document.title = `${name}|xl-vision`;

    return () => {
      document.title = title;
    };
  }, [name]);

  const callback = React.useCallback((e: MediaQueryListEvent) => {
    setDark(e.matches);
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(media.matches);

    media.addEventListener('change', callback);

    return () => {
      media.removeEventListener('change', callback);
    };
  }, [callback]);

  const classes = clsx(['markdown', `markdown--${isDark ? 'dark' : 'light'}`]);

  return <main className={classes}>{children}</main>;
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

export default Wrapper;
