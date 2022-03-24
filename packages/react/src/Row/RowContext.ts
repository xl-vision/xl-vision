import React from 'react';
import { Breakpoint } from '../ThemeProvider/breakpoints';

export default React.createContext<{
  gutter: number;
  breakPoints?: Array<[Breakpoint, boolean]>;
  removeOnUnvisible?: boolean;
}>({
  gutter: 0,
});
