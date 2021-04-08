import React from 'react';
import { isDevelopment } from '../utils/env';

export type DialogProps = {};

const displayName = 'Dialog';

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const {} = props;

  return <div ref={ref}></div>;
});

if (isDevelopment) {
  Dialog.displayName = displayName;
  Dialog.propTypes = {};
}

export default Dialog;
