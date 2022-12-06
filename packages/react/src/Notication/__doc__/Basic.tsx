/* eslint-disable @typescript-eslint/no-floating-promises */
import { Button, Notication, styled } from '@xl-vision/react';
import { useCallback } from 'react';

const Root = styled('div')(() => {
  return {
    '> *': {
      marginRight: 8,
    },
  };
});

const Demo = () => {
  const [message, holder] = Notication.useNotication();

  const handleInfo = useCallback(() => {
    message.info({
      message: 'message',
      description: 'this is a message',
    });
  }, [message]);

  const handleWarning = useCallback(() => {
    message.warning({
      message: 'message',
      description: 'this is a message',
    });
  }, [message]);

  const handleError = useCallback(() => {
    message.error({
      message: 'message',
      description: 'this is a message',
    });
  }, [message]);

  const handleSuccess = useCallback(() => {
    message.success({
      message: 'message',
      description: 'this is a message',
    });
  }, [message]);

  return (
    <Root>
      {holder}
      <Button color='info' onClick={handleInfo}>
        Info
      </Button>
      <Button color='warning' onClick={handleWarning}>
        Warn
      </Button>
      <Button color='error' onClick={handleError}>
        Error
      </Button>
      <Button color='success' onClick={handleSuccess}>
        Success
      </Button>
    </Root>
  );
};

export default Demo;
