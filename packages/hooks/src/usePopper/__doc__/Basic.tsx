import React from 'react';
import { usePopper, popperMiddlewares } from '@xl-vision/hooks';
import { styled, Button, Portal } from '@xl-vision/react';

const { offset, autoPlacement } = popperMiddlewares;

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

const PopperWrapper = styled('div')(({ theme }) => {
  return {
    top: 200,
    left: 100,
    position: 'absolute',

    '.popper': {
      padding: 8,
      borderRadius: 3,
      backgroundColor: theme.color.themes.success.color,
      cColor: theme.color.themes.success.text.primary,
    },
  };
});

const Demo = () => {
  const { reference, popper, x, y, mode, update } = usePopper({
    placement: 'right-end',
    mode: 'absolute',
    middlewares: [autoPlacement(), offset(10)],
  });

  const container = React.useCallback(() => document.body, []);

  const style = {
    position: mode,
    top: y,
    left: x,
  };

  return (
    <Root onScroll={update}>
      <Button className='reference' color='primary' ref={reference}>
        reference
      </Button>
      <Portal container={container}>
        <PopperWrapper>
          <div className='popper' ref={popper} style={style}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto quae possimus tempore
          </div>
        </PopperWrapper>
      </Portal>
    </Root>
  );
};

export default Demo;
