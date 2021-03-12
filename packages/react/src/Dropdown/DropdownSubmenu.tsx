import React, { ReactElement } from 'react';
import { isDevelopment } from '../utils/env';

export type DropdownSubmenuProps = {
  children: React.ReactElement;
  menus: Array<ReactElement>;
};

const displayName = 'DropdownSubmenu';

const DropdownSubmenu = React.forwardRef<HTMLDivElement, DropdownSubmenuProps>((props, ref) => {
  const {} = props;
  return <div ref={ref} />;
});

if (isDevelopment) {
  DropdownSubmenu.displayName = displayName;
  DropdownSubmenu.propTypes = {};
}

export default DropdownSubmenu;
