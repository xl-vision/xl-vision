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
  .ripple-leave-active {
    transition: all 0.4s ease;
  }
  .ripple-enter,
  .ripple-leave-to {
    transform: scale(0);
    opacity: 0.1;
  }
  .ripple-enter-to,
  .ripple-leave {
    transform: scale(1);
  }
`,
);

export default () => {
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
      <Ripple transitionClasses='ripple' ref={rippleRef} />
    </Box>
  );
};
