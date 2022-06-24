import React from 'react';
import { usePopper, PopperOptions, offset, Middleware } from '@xl-vision/hooks';
import { styled, Button, Portal, Row } from '@xl-vision/react';

const Demo = () => {
  const popper1Ref = React.useRef<CustomPopperInstance>(null);
  const popper2Ref = React.useRef<CustomPopperInstance>(null);
  const popper3Ref = React.useRef<CustomPopperInstance>(null);

  const middlewares1: Array<Middleware> = React.useMemo(() => {
    return [offset(10)];
  }, []);
  const middlewares2: Array<Middleware> = React.useMemo(() => {
    return [
      offset({
        crossAxis: 10,
      }),
    ];
  }, []);
  const middlewares3: Array<Middleware> = React.useMemo(() => {
    return [
      offset({
        mainAxis: 10,
        crossAxis: 10,
      }),
    ];
  }, []);

  const handleScroll = React.useCallback(() => {
    popper1Ref.current?.update();
    popper2Ref.current?.update();
    popper3Ref.current?.update();
  }, []);

  return (
    <DemoRoot onScroll={handleScroll}>
      <Row>
        <Row.Col column={6} offset={3}>
          <CustomPopper ref={popper1Ref} placement='top' middlewares={middlewares1} />
        </Row.Col>
        <Row.Col column={6}>
          <CustomPopper ref={popper2Ref} placement='top' middlewares={middlewares2} />
        </Row.Col>
        <Row.Col column={6}>
          <CustomPopper ref={popper3Ref} placement='top' middlewares={middlewares3} />
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
      height: 150,
      width: '100%',
    },
    '&:after': {
      display: 'block',
      content: '" "',
      height: 150,
      width: '100%',
    },

    '.reference': {
      marginLeft: 'calc(50% - 60px)',
    },
  };
});

const container = () => document.body;

type CustomPopperProps = Partial<PopperOptions> & {};

type CustomPopperInstance = {
  update: () => void;
};

const CustomPopper = React.forwardRef<CustomPopperInstance, CustomPopperProps>((props, ref) => {
  const rafIdRef = React.useRef<number | undefined>();

  const { reference, popper, x, y, mode, update } = usePopper({
    placement: 'top',
    mode: 'absolute',
    ...props,
  });

  React.useImperativeHandle(ref, () => {
    return {
      update,
    };
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
    top: 0,
    left: 0,
    transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  return (
    <>
      <Button className='reference' color='primary' ref={reference}>
        reference
      </Button>
      <Portal container={container}>
        <Popper ref={popper} style={style}>
          Lorem ipsum dolor sit amet.
        </Popper>
      </Portal>
    </>
  );
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
