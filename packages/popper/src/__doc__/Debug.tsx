import { styled, Button, Portal } from '@xl-vision/react';
import { useMemo, useCallback, CSSProperties, useEffect } from 'react';
import {
  usePopper,
  offset,
  autoPlacement,
  shift,
  hide,
  Side,
  PopperOptions,
} from '@xl-vision/popper';
import { Padding } from '../types';

const Root = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    backgroundColor: color.grey[400],
    borderRadius: 4,
    height: 200,
    padding: 20,
    overflow: 'auto',
    '.container': {
      height: 800,
    },

    '.box': {
      height: 300,
    },

    button: {
      // marginTop: 250,
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

const paddingFn = ({ side }: { side: Side }): Padding => {
  switch (side) {
    case 'top':
    case 'bottom': {
      return {
        bottom: 10,
        top: 10,
      };
    }
    default: {
      return {
        left: 10,
        right: 10,
      };
    }
  }
};

const Demo = () => {
  const popperOptions = useMemo<PopperOptions>(() => {
    return {
      placement: 'right',
      mode: 'absolute',
      middlewares: [
        shift({ padding: paddingFn }),
        autoPlacement({ padding: paddingFn }),
        offset(10),
        hide(),
      ],
    };
  }, []);

  const { reference, popper, x, y, mode, update: handleUpdate, extra } = usePopper(popperOptions);

  const hidden = extra.hide?.referenceHidden;

  const container = useCallback(() => document.body, []);

  const style: CSSProperties = {
    position: mode,
    top: y,
    left: x,
    visibility: hidden ? 'hidden' : 'visible',
  };

  useEffect(() => {
    document.addEventListener('scroll', handleUpdate);
    return () => {
      document.removeEventListener('scroll', handleUpdate);
    };
  }, [handleUpdate]);

  return (
    <Root onScroll={handleUpdate}>
      <div className='container'>
        <div className='box' />
        <Button className='reference' color='primary' ref={reference}>
          reference
        </Button>
        <Portal container={container}>
          <PopperWrapper>
            <div className='popper' ref={popper} style={style}>
              tooltip tooltip tooltip
            </div>
          </PopperWrapper>
        </Portal>
      </div>
    </Root>
  );
};

export default Demo;
