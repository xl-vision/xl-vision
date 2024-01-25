'use client';

import { useState, useCallback } from 'react';
import { Button, Dialog } from '@xl-vision/react';

const Prompt = () => {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Button color='primary' onClick={handleClick}>
        click
      </Button>
      <Dialog open={open} prompt={true} title='Message' onOpenChange={setOpen}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores quidem fugiat
        aspernatur, odio, quo esse molestias porro maxime sit itaque quam soluta autem illo,
        corporis nihil alias sint tempora.
      </Dialog>
    </>
  );
};

export default Prompt;
