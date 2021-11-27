import React from 'react';
import ThemeContext from './ThemeContext';

const useTheme = () => {
  return React.useContext(ThemeContext);
};

export default useTheme;
