'use client';

import { useState, useCallback } from 'react';
import { Button, Dialog, Message } from '@xl-vision/react';

const PromiseComponent = () => {
  const [open, setOpen] = useState(false);
  const [message, holder] = Message.useMessage();

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }, []);
  const handleCancel = useCallback(() => {
    message.info(`cancel`);
  }, [message]);

  return (
    <>
      {holder}
      <Button color='primary' onClick={handleClick}>
        click
      </Button>
      <Dialog
        escClosable={false}
        maskClosable={false}
        open={open}
        title='Are you sure?'
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onOpenChange={setOpen}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores quidem fugiat
        aspernatur, odio, quo esse molestias porro maxime sit itaque quam soluta autem illo,
        corporis nihil alias sint tempora.
      </Dialog>
    </>
  );
};

export default PromiseComponent;
