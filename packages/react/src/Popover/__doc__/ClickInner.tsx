import { useState } from 'react';
import { Button, Popover } from '@xl-vision/react';

const ClickInner = () => {
  const [open, setOpen] = useState(false);

  const content = (
    <Button color='primary' variant='text' onClick={() => setOpen(false)}>
      close
    </Button>
  );

  return (
    <Popover content={content} open={open} title='title' trigger='click' onOpenChange={setOpen}>
      <Button color='primary'>click</Button>
    </Popover>
  );
};

export default ClickInner;
