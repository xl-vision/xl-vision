'use client';

import { Button, ButtonInstance, Portal } from '@xl-vision/react';
import { RefCallback, useCallback, useState } from 'react';
import {
  useAutoUpdatePopper,
  useConnectInteraction,
  useHover,
  useInteraction,
} from '@xl-vision/usePopper';

const container = () => document.body;

const Demo = () => {
  const [open, setOpen] = useState(false);

  const { reference, popper, x, y, mode, context } = useConnectInteraction(
    useAutoUpdatePopper({
      placement: 'top',
      mode: 'absolute',
    }),
    {
      open,
      setOpen,
    },
  );

  const referenceRef = useCallback<RefCallback<ButtonInstance>>(
    (instance) => {
      reference(instance?.nativeElement || null);
    },
    [reference],
  );

  const style = {
    position: mode,
    top: 0,
    left: 0,
    transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
  };

  const { getPopperProps, getReferenceProps } = useInteraction(useHover(context));

  return (
    <>
      <Button {...getReferenceProps({})} className='reference' color='primary' ref={referenceRef}>
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
