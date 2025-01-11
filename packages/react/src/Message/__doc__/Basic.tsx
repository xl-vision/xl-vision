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
    void message.info('hello world');
  }, [message]);

  const handleWarning = useCallback(() => {
    void message.warning('hello world');
  }, [message]);

  const handleError = useCallback(() => {
    void message.error('hello world');
  }, [message]);

  const handleSuccess = useCallback(() => {
    void message.success('hello world');
  }, [message]);

  const handleLoading = useCallback(() => {
    void message.loading('hello world');
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
      <Button color='primary' onClick={handleLoading}>
        Loading
      </Button>
    </Root>
  );
};

export default Demo;
