'use client';

import { styled, Button, Portal, Row } from '@xl-vision/react';
import { CSSProperties, useEffect, useMemo, useRef } from 'react';
import { usePopper, hide, Middleware } from '@xl-vision/usePopper';

const container = () => document.body;

const Demo = () => {
  const middlewares: Array<Middleware> = useMemo(() => {
    return [hide()];
  }, []);

  const { reference, popper, x, y, mode, update, extra } = usePopper({
    placement: 'right',
    mode: 'absolute',
    middlewares,
  });

  const rafIdRef = useRef<number>(null);

  const handleUpdate = useMemo(() => {
    // 节流
    const throttle = () => {
      if (rafIdRef.current) {
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
    document.addEventListener('scroll', handleUpdate);
    return () => {
      document.removeEventListener('scroll', handleUpdate);
    };
  }, [handleUpdate]);

  const hidden = extra.hide?.referenceHidden;

  const style: CSSProperties = {
    position: mode,
    top: 0,
    left: 0,
    visibility: hidden ? 'hidden' : 'visible',
    transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  return (
    <DemoRoot onScroll={handleUpdate}>
      <Row>
        <Row.Col column={6} offset={9}>
          <Button className='reference' color='primary' ref={reference}>
            reference
          </Button>
          <Portal container={container}>
            <Popper ref={popper} style={style}>
              Lorem ipsum dolor sit amet.
            </Popper>
          </Portal>
        </Row.Col>
      </Row>
    </DemoRoot>
  );
};

export default Demo;

const DemoRoot = styled('div')(({ theme }) => {
  const { colors } = theme;
  return {
    position: 'relative',
    height: 200,
    overflow: 'auto',
    backgroundColor: colors.background.default,

    '&:before': {
      display: 'block',
      content: '" "',
      height: 220,
      width: '100%',
    },
    '&:after': {
      display: 'block',
      content: '" "',
      height: 220,
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
    maxWidth: 100,
    color: colors.text.spotlight,
    backgroundColor: colors.background.spotlight,
  };
});
