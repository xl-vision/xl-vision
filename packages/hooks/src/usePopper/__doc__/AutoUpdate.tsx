import { autoUpdate, usePopper } from '@xl-vision/hooks';
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
  const { reference, popper, x, y, mode } = usePopper({
    placement: 'top',
    mode: 'absolute',
    onElementMounted(referenceEl, popperEl, updateCb) {
      return autoUpdate(referenceEl, popperEl, updateCb);
    },
  });

  const style = {
    position: mode,
    top: 0,
    left: 0,
    transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  return (
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
  );
};

export default Demo;
