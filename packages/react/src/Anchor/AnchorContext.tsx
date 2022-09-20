import { noop } from '@xl-vision/utils';
import { createContext } from 'react';

export type AnchorContextProps = {
  registerLink: (link: string) => void;
  unregisterLink: (link: string) => void;
  scrollTo: (link: string) => void;
  activeLink: string;
};

export default createContext<AnchorContextProps>({
  registerLink: noop,
  unregisterLink: noop,
  scrollTo: noop,
  activeLink: '',
});
