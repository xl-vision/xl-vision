import React from 'react';
import { isDevelopment } from '../utils/env';

export type DropdownDividerProps = {};

const displayName = 'DropdownDivider';

const DropdownDivider = React.forwardRef<HTMLDivElement, DropdownDividerProps>((props, ref) => {
  const {} = props;
  return <div ref={ref} />;
});

if (isDevelopment) {
  DropdownDivider.displayName = displayName;
  DropdownDivider.propTypes = {};
}

export default DropdownDivider;
