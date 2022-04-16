import React from 'react';
import { usePopper, Middleware, popperMiddlewares } from '@xl-vision/hooks';
import { styled, Button, Portal } from '@xl-vision/react';

const container = () => document.body;

const { autoPlacement } = popperMiddlewares;

const Demo = () => {
  const rafIdRef = React.useRef<number | undefined>();

  const middlewares: Array<Middleware> = React.useMemo(() => {
    return [autoPlacement()];
  }, []);

  const { reference, popper, x, y, mode, update } = usePopper({
    placement: 'right',
    mode: 'absolute',
    middlewares,
  });

  const handleUpdate = React.useMemo(() => {
    // 节流
    const throttle = () => {
      if (rafIdRef.current !== undefined) {
        return;
      }
      rafIdRef.current = requestAnimationFrame(() => {
        update();
        rafIdRef.current = undefined;
      });
    };
    return throttle;
  }, [update]);

  React.useEffect(() => {
    return () => {
      if (rafIdRef.current !== undefined) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    document.addEventListener('scroll', handleUpdate);
    return () => {
      document.removeEventListener('scroll', handleUpdate);
    };
  }, [handleUpdate]);

  const style = {
    position: mode,
    top: y,
    left: x,
  };

  return (
    <>
      <Root onScroll={handleUpdate}>
        <Button className='reference' color='primary' ref={reference}>
          reference
        </Button>
      </Root>
      <Portal container={container}>
        <Popper ref={popper} style={style}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae pellentesque elit,
          in dapibus enim. Aliquam hendrerit iaculis facilisis.
        </Popper>
      </Portal>
    </>
  );
};

export default Demo;

const Root = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    position: 'relative',
    height: 300,
    overflow: 'auto',
    backgroundColor: color.background.default,

    '&:before': {
      display: 'block',
      content: '" "',
      height: 250,
      width: '100%',
    },
    '&:after': {
      display: 'block',
      content: '" "',
      height: 250,
      width: '100%',
    },

    '.reference': {
      marginLeft: 'calc(50% - 60px)',
    },
  };
});

const Popper = styled('div')(({ theme }) => {
  const { color } = theme;

  const baseColor = color.mode === 'dark' ? color.modes.light : color.modes.dark;

  return {
    padding: 8,
    borderRadius: 4,
    maxWidth: 200,
    color: baseColor.text.primary,
    backgroundColor: color.emphasize(baseColor.background.paper, 0.1),
  };
});
