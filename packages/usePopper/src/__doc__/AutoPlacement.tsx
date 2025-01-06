'use client';

import { styled, Button, Portal } from '@xl-vision/react';
import { useRef, useMemo, useEffect } from 'react';
import { usePopper, Middleware, autoPlacement } from '@xl-vision/usePopper';

const container = () => document.body;

const Demo = () => {
  const rafIdRef = useRef<number>(null);

  const middlewares: Array<Middleware> = useMemo(() => {
    return [autoPlacement()];
  }, []);

  const { reference, popper, x, y, mode, update } = usePopper({
    placement: 'right',
    mode: 'absolute',
    middlewares,
  });

  const handleUpdate = useMemo(() => {
    // 节流
    const throttle = () => {
      if (!rafIdRef.current) {
        return;
      }
      rafIdRef.current = requestAnimationFrame(() => {
        update();
        rafIdRef.current = null;
      });
    };
    return throttle;
  }, [update]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
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
  const { colors } = theme;
  return {
    position: 'relative',
    height: 300,
    overflow: 'auto',
    backgroundColor: colors.background.default,

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
  const { colors } = theme;

  return {
    padding: 8,
    borderRadius: 4,
    maxWidth: 200,
    color: colors.text.spotlight,
    backgroundColor: colors.background.spotlight,
  };
});
