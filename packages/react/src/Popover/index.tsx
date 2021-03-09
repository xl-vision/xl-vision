import React from 'react';
import { isDevelopment } from '../utils/env';

export type PopoverProps = {};

const displayName = 'Popover';

const Popover: React.FunctionComponent<PopoverProps> = (props) => {
  const {} = props;

  return <div></div>;
};

if (isDevelopment) {
  Popover.displayName = displayName;

  Popover.propTypes = {};
}

export default Popover;
