import { createContext } from 'react';
import { Breakpoint } from '../ThemeProvider/breakpoints';

export default createContext<{
  gutter: number;
  breakPoints?: Array<[Breakpoint, boolean]>;
  removeOnUnvisible?: boolean;
}>({
  gutter: 0,
});
