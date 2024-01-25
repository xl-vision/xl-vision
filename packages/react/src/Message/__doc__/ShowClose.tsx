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
  const [message, holder] = Message.useMessage();

  const handleInfo = useCallback(() => {
    message.info({
      content: 'hello world',
      duration: 0,
      showClose: true,
    });
  }, [message]);

  return (
    <Root>
      {holder}
      <Button color='info' onClick={handleInfo}>
        click
      </Button>
    </Root>
  );
};

export default Demo;
