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
  const handleInfo = useCallback(() => {
    void Message.info('hello world');
  }, []);

  const handleWarning = useCallback(() => {
    void Message.warning('hello world');
  }, []);

  const handleError = useCallback(() => {
    void Message.error('hello world');
  }, []);

  const handleSuccess = useCallback(() => {
    void Message.success('hello world');
  }, []);

  const handleLoading = useCallback(() => {
    void Message.loading('hello world').then(() => Message.info('successful'));
  }, []);

  return (
    <Root>
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
