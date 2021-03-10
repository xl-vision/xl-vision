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
})(({ theme }) => {
  const { color, elevations, clsPrefix } = theme;

  const bgColor = color.background.paper;

  return {
    [`.${clsPrefix}-tooltip__content`]: {
      backgroundColor: bgColor,
      color: color.getContrastText(bgColor).text.primary,

      ...elevations(16),
    },
    [`.${clsPrefix}-tooltip__arrow`]: {
      backgroundColor: color.background.paper,
    },
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
