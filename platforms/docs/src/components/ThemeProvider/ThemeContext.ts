import { noop } from '@xl-vision/utils';
import { createContext } from 'react';

export type ThemeContextProps = {
  isDark: boolean;
  setDark: (value: boolean | ((prev: boolean) => boolean)) => void;
};

export default createContext<ThemeContextProps>({
  isDark: false,
  setDark: noop,
});
