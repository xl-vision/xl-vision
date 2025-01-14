'use client';

import { useCallback } from 'react';
import { Button, Dialog, styled } from '@xl-vision/react';

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
    const dialog = Dialog.open({
      title: 'Dialog',
      content: `This message will close after ${i}s.`,
    });

    void dialog.then(() =>
      Dialog.info({
        title: 'Dialog',
        content: 'close successfully!',
      }),
    );

    const timer = setInterval(() => {
      if (dialog.isDestroyed()) {
        return;
      }

      i--;

      if (i <= 0) {
        dialog.destroy();
        clearInterval(timer);
      } else {
        dialog.update({ content: `This message will close after ${i}s.` });
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
