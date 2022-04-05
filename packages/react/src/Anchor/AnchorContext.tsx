import React from 'react';
import { noop } from '../utils/function';

export type AnchorContextProps = {
  registerLink: (link: string) => void;
  unregisterLink: (link: string) => void;
  scrollTo: (link: string) => void;
  activeLink: string;
};

export default React.createContext<AnchorContextProps>({
  registerLink: noop,
  unregisterLink: noop,
  scrollTo: noop,
  activeLink: '',
});