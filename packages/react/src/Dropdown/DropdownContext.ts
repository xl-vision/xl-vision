import { noop } from '@xl-vision/utils';
import { createContext } from 'react';

export type DropdownContextProps = {
  submenuCloseHandlers: Array<() => void>;
  setOpen: (open: boolean) => void;
};

export default createContext<DropdownContextProps>({
  submenuCloseHandlers: [],
  setOpen: noop,
});
