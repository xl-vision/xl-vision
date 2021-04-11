/* eslint-disable no-console */
/* eslint-disable react/jsx-handler-names */
import { Button, Dialog } from '@xl-vision/react';
import React from 'react';

export default () => {
  const handleInfo = React.useCallback(() => {
    Dialog.info({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, []);

  const handleSuccess = React.useCallback(() => {
    Dialog.success({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, []);

  const handleError = React.useCallback(() => {
    Dialog.error({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, []);

  const handleWarning = React.useCallback(() => {
    Dialog.warning({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    Dialog.confirm({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, []);

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
