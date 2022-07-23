import { useAutoUpdatePopper, useEnhancement } from '@xl-vision/popper';
import { Button, Portal, styled } from '@xl-vision/react';
import React from 'react';

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

const Demo = () => {
  const [enable, setEnable] = React.useState(true);

  const { reference, popper, x, y, mode } = useAutoUpdatePopper({
    placement: 'top',
    mode: 'absolute',
    ancestorResize: enable,
    ancestorScroll: enable,
    elementResize: enable,
    animationFrame: false,
  });

  const style = {
    position: mode,
    top: 0,
    left: 0,
    transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  return (
    <>
      <Button
        color='primary'
        style={{ marginBottom: 10 }}
        onClick={() => setEnable((prev) => !prev)}
      >
        {enable ? '禁用' : '启用'}
      </Button>
      <DemoRoot>
        <Button className='reference' color='primary' ref={reference}>
          reference
        </Button>
        <Portal container={container}>
          <div ref={popper} style={style}>
            Lorem ipsum dolor sit amet.
          </div>
        </Portal>
      </DemoRoot>
    </>
  );
};

export default Demo;
