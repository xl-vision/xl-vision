import React from 'react';
import PropTypes from 'prop-types';

export type ThemeProviderProps = {
  children: React.ReactNode;
};

export type ThemeContextProps = {
  isDark: boolean;
  setDark: (value: boolean) => void;
};

export const ThemeContext = React.createContext<ThemeContextProps>({
  isDark: false,
  setDark: () => {},
});

const ThemeProvider: React.FunctionComponent<ThemeProviderProps> = (props) => {
  const { children } = props;

  const [isDark, setDark] = React.useState(false);

  return <ThemeContext.Provider value={{ isDark, setDark }}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
