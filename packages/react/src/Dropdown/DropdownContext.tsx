import React from 'react';

export type DropdownContextProps = {
  submenuCloseHandlers: Array<() => void>;
};

export default React.createContext<DropdownContextProps>({
  submenuCloseHandlers: [],
});
