import React from 'react';
import { usePopper, useHover, useEnhancement, useAutoUpdate } from '@xl-vision/popper';
import { Button, Portal } from '@xl-vision/react';

const container = () => document.body;

const Demo = () => {
  const { reference, popper, x, y, mode, update, refs } = usePopper({
    placement: 'top',
    mode: 'absolute',
  });

  const [open, setOpen] = React.useState(false);

  const style = {
    position: mode,
    top: 0,
    left: 0,
    transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  const { getPopperProps, getReferenceProps } = useEnhancement(
    useAutoUpdate({ open, setOpen, refs, update }),
    useHover({ open, setOpen, refs, update }),
  );

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
