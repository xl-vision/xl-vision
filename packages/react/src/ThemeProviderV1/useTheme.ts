import { useContext } from 'react';
import ThemeContext from './ThemeContext';

const useTheme = () => {
  return useContext(ThemeContext);
};

export default useTheme;
