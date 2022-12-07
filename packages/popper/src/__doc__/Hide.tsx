import { styled, Button, Portal, Row } from '@xl-vision/react';
import { CSSProperties, useEffect, useMemo, useRef } from 'react';
import { usePopper, hide, Middleware } from '@xl-vision/popper';

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

  const rafIdRef = useRef<number | undefined>();

  const handleUpdate = useMemo(() => {
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
  const { color } = theme;
  return {
    position: 'relative',
    height: 200,
    overflow: 'auto',
    backgroundColor: color.background.default,

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
  const { color } = theme;

  const baseColor = color.mode === 'dark' ? color.modes.light : color.modes.dark;

  return {
    padding: 8,
    borderRadius: 4,
    maxWidth: 100,
    color: baseColor.text.primary,
    backgroundColor: color.emphasize(baseColor.background.paper, 0.1),
  };
});
