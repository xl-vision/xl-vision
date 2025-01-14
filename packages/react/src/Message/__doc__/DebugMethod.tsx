'use client';

import { useCallback } from 'react';
import { Button, Message, styled } from '@xl-vision/react';

const Root = styled('div')(() => {
  return {
    '> *': {
      marginRight: 8,
    },
  };
});

const Demo = () => {
  const handleClick = useCallback(() => {
    let i = 5;
    const message = Message.open({
      content: `This message will close after ${i}s.`,
      duration: 0,
    });

    void message.then(() => Message.info('close successfully!'));

    const timer = setInterval(() => {
      if (message.isDestroyed()) {
        return;
      }
      i--;

      if (i <= 0) {
        message.destroy();
        clearInterval(timer);
      } else {
        message.update({ content: `This message will close after ${i}s.` });
      }
    }, 1000);
  }, []);

  return (
    <Root>
      <Button color='info' onClick={handleClick}>
        Info
      </Button>
    </Root>
  );
};

export default Demo;
