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
  const handleInfo = useCallback(() => {
    void Notication.info('hello world');
  }, []);

  const handleWarning = useCallback(() => {
    void Notication.warning('hello world');
  }, []);

  const handleError = useCallback(() => {
    void Notication.error('hello world');
  }, []);

  const handleSuccess = useCallback(() => {
    void Notication.success('hello world');
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
    </Root>
  );
};

export default Demo;
