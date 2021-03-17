import React from 'react';
import { voidFn } from '../utils/function';

export type DropdownItemContextProps = {
  setVisible: (visible: boolean) => void;
};

export default React.createContext<DropdownItemContextProps>({
  setVisible: voidFn,
});
