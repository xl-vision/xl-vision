import React from 'react';
import { isDevelopment } from '../utils/env';

export type DropdownMenuProps = {};

const displayName = 'DropdownMenu';

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>((props, ref) => {
  const {} = props;
  return <div ref={ref} />;
});

if (isDevelopment) {
  DropdownMenu.displayName = displayName;
  DropdownMenu.propTypes = {};
}

export default DropdownMenu;
