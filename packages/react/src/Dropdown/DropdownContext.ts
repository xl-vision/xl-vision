import React from 'react';
import { noop } from '@xl-vision/utils';

export type DropdownContextProps = {
  submenuCloseHandlers: Array<() => void>;
  setVisible: (visible: boolean) => void;
};

export default React.createContext<DropdownContextProps>({
  submenuCloseHandlers: [],
  setVisible: noop,
});
