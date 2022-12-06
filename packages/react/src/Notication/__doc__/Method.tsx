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
  const handleInfo = useCallback(() => {
    Notication.info('hello world');
  }, []);

  const handleWarning = useCallback(() => {
    Notication.warning('hello world');
  }, []);

  const handleError = useCallback(() => {
    Notication.error('hello world');
  }, []);

  const handleSuccess = useCallback(() => {
    Notication.success('hello world');
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
