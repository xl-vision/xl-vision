import React from 'react';
import { styled } from '../styles';
import Tooltip, { TooltipProps } from '../Tooltip';
import { isDevelopment } from '../utils/env';

export interface PopoverProps extends TooltipProps {
  title?: React.ReactNode;
}

const displayName = 'Popover';

const PopoverRoot = styled(Tooltip, {
  name: displayName,
  slot: 'Root',
})(() => {
  return {
    
  };
});

const Popover = React.forwardRef<unknown, PopoverProps>((props, ref) => {
  const { title, content, ...others } = props;

  const popup = (
    <>
      {title}
      {content}
    </>
  );

  return <PopoverRoot {...others} ref={ref} content={popup} />;
});

if (isDevelopment) {
  Popover.displayName = displayName;

  Popover.propTypes = {};
}

export default Popover;
