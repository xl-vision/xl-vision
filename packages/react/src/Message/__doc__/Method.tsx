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
    Message.info('hello world');
  }, []);

  const handleWarning = useCallback(() => {
    Message.warning('hello world');
  }, []);

  const handleError = useCallback(() => {
    Message.error('hello world');
  }, []);

  const handleSuccess = useCallback(() => {
    Message.success('hello world');
  }, []);

  const handleLoading = useCallback(() => {
    Message.loading('hello world').then(() => Message.info('successful'));
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
