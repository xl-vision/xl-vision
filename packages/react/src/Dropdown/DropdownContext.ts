import { noop } from '@xl-vision/utils';
import { createContext } from 'react';

export type DropdownContextProps = {
  submenuCloseHandlers: Array<() => void>;
  setVisible: (visible: boolean) => void;
};

export default createContext<DropdownContextProps>({
  submenuCloseHandlers: [],
  setVisible: noop,
});
