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
      <Button color='primary' onClick={handleInfo}>
        info
      </Button>
      <Button color='primary' onClick={handleSuccess}>
        success
      </Button>
      <Button color='primary' onClick={handleError}>
        error
      </Button>
      <Button color='primary' onClick={handleWarning}>
        warning
      </Button>
      <Button color='primary' onClick={handleConfirm}>
        confirm
      </Button>
    </>
  );
};
