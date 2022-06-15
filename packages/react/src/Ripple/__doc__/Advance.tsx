import React from 'react';
import { Ripple, RippleRef, styled } from '@xl-vision/react';

const Box = styled('div')(
  ({ theme }) => `
  position: relative;
  height: 100px;
  background-color: ${theme.color.divider};
  color: ${theme.color.themes.primary.color};
  font-size: 26px;
  text-align: center;
  line-height: 100px;

  .xl-ripple {
    opacity: 0.5;
  }
  .ripple-enter-active,
  .ripple-exit-active {
    transition: all 0.4s ease;
  }
  .ripple-enter-from,
  .ripple-exit-to {
    transform: scale(0);
    opacity: 0.1;
  }
  .ripple-enter-to,
  .ripple-exit-from {
    transform: scale(1);
  }
`,
);

const Advance = () => {
  const rippleRef = React.useRef<RippleRef>(null);

  const events = React.useMemo(() => {
    const start = (e: React.SyntheticEvent) => {
      rippleRef.current?.start(e);
    };
    const stop = () => {
      rippleRef.current?.stop();
    };
    return {
      onMouseDown: start,
      onTouchStart: start,
      onMouseUp: stop,
      onTouchEnd: stop,
      onTouchMove: stop,
      onMouseLeave: stop,
      onDragLeave: stop,
    };
  }, []);

  return (
    <Box {...events}>
      click me
      <Ripple transitionClassName='ripple' ref={rippleRef} leaveAfterEnter={true} />
    </Box>
  );
};

export default Advance;
