import { Button, Dialog } from '@xl-vision/react';
import React from 'react';

export default () => {
  const Modal = Dialog.useHooks();

  const handleInfo = React.useCallback(() => {
    Modal.info({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [Modal]);

  const handleSuccess = React.useCallback(() => {
    Modal.success({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [Modal]);

  const handleError = React.useCallback(() => {
    Modal.error({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [Modal]);

  const handleWarning = React.useCallback(() => {
    Modal.warning({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [Modal]);

  const handleConfirm = React.useCallback(() => {
    Modal.confirm({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [Modal]);

  return (
    <>
      <Button theme='primary' onClick={handleInfo}>
        info
      </Button>
      <Button theme='primary' onClick={handleSuccess}>
        success
      </Button>
      <Button theme='primary' onClick={handleError}>
        error
      </Button>
      <Button theme='primary' onClick={handleWarning}>
        warning
      </Button>
      <Button theme='primary' onClick={handleConfirm}>
        confirm
      </Button>
    </>
  );
};
