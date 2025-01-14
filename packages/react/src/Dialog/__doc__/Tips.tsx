'use client';

import { useCallback } from 'react';
import { Button, Dialog } from '@xl-vision/react';

const Tips = () => {
  const handleInfo = useCallback(() => {
    void Dialog.info({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, []);

  const handleSuccess = useCallback(() => {
    void Dialog.success({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, []);

  const handleError = useCallback(() => {
    void Dialog.error({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, []);

  const handleWarning = useCallback(() => {
    void Dialog.warning({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, []);

  const handleConfirm = useCallback(() => {
    void Dialog.confirm({
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

export default Tips;
