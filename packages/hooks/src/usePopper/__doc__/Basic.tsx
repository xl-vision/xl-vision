import React from 'react';
import { usePopper } from '@xl-vision/hooks';
import { styled, Button, Portal } from '@xl-vision/react';

const Root = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    backgroundColor: color.grey[400],
    borderRadius: 4,
    height: 200,
    padding: 20,
    overflow: 'auto',
    button: {
      marginTop: 250,
    },
  };
});

const PopperWrapper = styled('div')(() => {
  return {
    top: 200,
    left: 100,
  };
});

const Demo = () => {
  const { reference, popper, data, update } = usePopper();

  const container = React.useCallback(() => document.body, []);

  const style = {
    position: data.mode,
    top: data.y,
    left: data.x,
  };

  return (
    <Root onScroll={update}>
      <Button className='reference' color='primary' ref={reference}>
        reference
      </Button>
      <Portal container={container}>
        <PopperWrapper>
          <div className='popper' ref={popper} style={style}>
            popper
          </div>
        </PopperWrapper>
      </Portal>
    </Root>
  );
};

export default Demo;
