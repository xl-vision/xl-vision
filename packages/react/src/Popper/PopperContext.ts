import React from 'react';
import { voidFn } from '../utils/function';

export type PopperContextProps = {
  addCloseHandler: (handler: () => void) => void;
  removeCloseHandler: (handler: () => void) => void;
};

export default React.createContext<PopperContextProps>({
  addCloseHandler: voidFn,
  removeCloseHandler: voidFn,
});
