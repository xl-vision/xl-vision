/* eslint-disable @typescript-eslint/no-floating-promises */
import { Button, Message, styled } from '@xl-vision/react';
import { useCallback } from 'react';

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
    message.info('doing some work').then(() => {
      message.success('done successful');
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
