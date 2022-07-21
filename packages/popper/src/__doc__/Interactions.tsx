import React from 'react';
import {
  useAutoUpdatePopper,
  useHover,
  useInteractions,
  InteractionContext,
} from '@xl-vision/popper';
import { Button, Portal } from '@xl-vision/react';

const container = () => document.body;

const Demo = () => {
  const { reference, popper, x, y, mode, context } = useAutoUpdatePopper({
    placement: 'top',
    mode: 'absolute',
  });

  const [open, setOpen] = React.useState(false);

  const interactionContext: InteractionContext = {
    ...context,
    open,
    setOpen,
  };

  const style = {
    position: mode,
    top: 0,
    left: 0,
    transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  const { getPopperProps, getReferenceProps } = useInteractions(useHover(interactionContext));

  return (
    <>
      <Button {...getReferenceProps({})} ref={reference} className='reference' color='primary'>
        reference
      </Button>
      {open && (
        <Portal container={container}>
          <div {...getPopperProps({ style })} ref={popper}>
            Lorem ipsum dolor sit amet.
          </div>
        </Portal>
      )}
    </>
  );
};

export default Demo;
