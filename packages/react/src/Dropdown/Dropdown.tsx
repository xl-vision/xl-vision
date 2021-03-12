import React, { ReactElement } from 'react';
import { isDevelopment } from '../utils/env';

export type DropdownProps = {
  children: React.ReactElement;
  menus: Array<ReactElement>;
};

const displayName = 'Dropdown';

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>((props, ref) => {
  const {} = props;
  return <div ref={ref} />;
});

if (isDevelopment) {
  Dropdown.displayName = displayName;
  Dropdown.propTypes = {};
}

export default Dropdown;
