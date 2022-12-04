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
  const [message, holder] = Message.useMessage({ maxCount: 3 });

  const handleInfo = useCallback(() => {
    message.info({
      content: 'hello world',
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
