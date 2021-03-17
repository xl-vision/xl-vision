import React from 'react';

export type DropdownContextProps = {
  childrenCloseHandlers: Array<() => void>;
};

export default React.createContext<DropdownContextProps>({
  childrenCloseHandlers: [],
});
