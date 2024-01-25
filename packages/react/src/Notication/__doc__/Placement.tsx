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
  const [message1, holder1] = Notication.useNotication({ placement: 'top-right' });
  const [message2, holder2] = Notication.useNotication({ placement: 'top-left' });
  const [message3, holder3] = Notication.useNotication({ placement: 'bottom-right' });
  const [message4, holder4] = Notication.useNotication({ placement: 'bottom-left' });

  const handleInfo1 = useCallback(() => {
    message1.info({
      message: 'message',
      description: 'this is a message',
    });
  }, [message1]);

  const handleInfo2 = useCallback(() => {
    message2.info({
      message: 'message',
      description: 'this is a message',
    });
  }, [message2]);

  const handleInfo3 = useCallback(() => {
    message3.info({
      message: 'message',
      description: 'this is a message',
    });
  }, [message3]);

  const handleInfo4 = useCallback(() => {
    message4.info({
      message: 'message',
      description: 'this is a message',
    });
  }, [message4]);

  return (
    <Root>
      {holder1}
      {holder2}
      {holder3}
      {holder4}
      <Button color='primary' onClick={handleInfo1}>
        top-right
      </Button>
      <Button color='primary' onClick={handleInfo2}>
        top-left
      </Button>
      <Button color='primary' onClick={handleInfo3}>
        bottom-right
      </Button>
      <Button color='primary' onClick={handleInfo4}>
        bottom-left
      </Button>
    </Root>
  );
};

export default Demo;
