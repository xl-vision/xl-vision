import {
  arrow,
  shift,
  Middleware,
  useAutoUpdatePopper,
  Placement,
  offset,
} from '@xl-vision/popper';
import { styled, Button, Portal, Row } from '@xl-vision/react';
import { useMemo, CSSProperties } from 'react';

const Demo = () => {
  return (
    <DemoRoot>
      <Row>
        <Row.Col column={6} offset={3} />
        <Row.Col column={6}>
          <CustomPopper placement='left' />
        </Row.Col>
        <Row.Col column={6} />
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
      height: 200,
      width: '100%',
    },
    '&:after': {
      display: 'block',
      content: '" "',
      height: 200,
      width: '100%',
    },

    '.reference': {
      marginLeft: 'calc(50% - 60px)',
    },
  };
});

const container = () => document.body;

const CustomPopper = ({ placement: initialPlacement }: { placement: Placement }) => {
  const middlewares: Array<Middleware> = useMemo(() => {
    return [shift(), offset(10), arrow()];
  }, []);

  const { reference, popper, placement, x, y, mode, extra } = useAutoUpdatePopper({
    placement: initialPlacement,
    mode: 'absolute',
    middlewares,
  });

  const style = {
    position: mode,
    top: 0,
    left: 0,
    transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  const arrowStyle: CSSProperties = {
    left: extra.arrow?.x ? Math.round(Math.max(extra.arrow.x - 4, 0)) : '',
    top: extra.arrow?.y ? Math.round(Math.max(extra.arrow.y - 4, 0)) : '',
  };

  if (placement.match(/^top/)) {
    arrowStyle.bottom = -4;
  } else if (placement.match(/^bottom/)) {
    arrowStyle.top = -4;
  } else if (placement.match(/^left/)) {
    arrowStyle.right = -4;
  } else {
    arrowStyle.left = -4;
  }

  return (
    <>
      <Button className='reference' color='primary' ref={reference}>
        reference
      </Button>
      <Portal container={container}>
        <Popper ref={popper} style={style}>
          <Arrow style={arrowStyle} />
          Lorem ipsum dolor sit amet.
        </Popper>
      </Portal>
    </>
  );
};

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

const Arrow = styled('div')(() => {
  return {
    position: 'absolute',
    width: 8,
    height: 8,
    transform: 'rotate(45deg)',
    backgroundColor: 'inherit',
  };
});
