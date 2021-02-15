import PropTypes from 'prop-types';
import React from 'react';
import createTheme, { BaseTheme } from '../styles/createTheme';
import ThemeContext from '../styles/ThemeContext';

export type ThemeProviderProps = {
  children: React.ReactNode;
  theme: BaseTheme;
};

const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = (props) => {
  const { children, theme } = props;

  const value = React.useMemo(() => {
    return createTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.object.isRequired,
};

export default ThemeProvider;
