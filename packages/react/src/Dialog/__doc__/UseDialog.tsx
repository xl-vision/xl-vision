import { Button, Dialog } from '@xl-vision/react';
import React from 'react';

export default () => {
  const [dialog, holders] = Dialog.useDialog();

  const handleInfo = React.useCallback(() => {
    dialog.info({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  const handleSuccess = React.useCallback(() => {
    dialog.success({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  const handleError = React.useCallback(() => {
    dialog.error({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  const handleWarning = React.useCallback(() => {
    dialog.warning({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  const handleConfirm = React.useCallback(() => {
    dialog.confirm({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  return (
    <>
      {holders}
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
