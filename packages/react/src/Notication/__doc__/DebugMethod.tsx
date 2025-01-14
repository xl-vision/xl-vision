'use client';

import { useCallback } from 'react';
import { Button, Notication, styled } from '@xl-vision/react';

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
    const notication = Notication.open({
      message: 'Message',
      description: `This message will close after ${i}s.`,
      duration: 0,
    });

    void notication.then(() => Notication.info('close successfully!'));

    const timer = setInterval(() => {
      if (notication.isDestroyed()) {
        return;
      }

      i--;

      if (i <= 0) {
        notication.destroy();
        clearInterval(timer);
      } else {
        notication.update({ description: `This message will close after ${i}s.` });
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
