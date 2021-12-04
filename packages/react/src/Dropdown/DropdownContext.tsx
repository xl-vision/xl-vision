import React from 'react';
import { noop } from '../utils/function';

export type DropdownContextProps = {
  submenuCloseHandlers: Array<() => void>;
  setVisible: (visible: boolean) => void;
};

export default React.createContext<DropdownContextProps>({
  submenuCloseHandlers: [],
  setVisible: noop,
});
