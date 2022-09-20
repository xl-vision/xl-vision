import { Button, Dialog } from '@xl-vision/react';

const UseDialog = () => {
  const [dialog, holders] = Dialog.useDialog();

  const handleInfo = useCallback(() => {
    dialog.info({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  const handleSuccess = useCallback(() => {
    dialog.success({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  const handleError = useCallback(() => {
    dialog.error({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  const handleWarning = useCallback(() => {
    dialog.warning({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  const handleConfirm = useCallback(() => {
    dialog.confirm({
      title: 'some messages...some messages...',
      content: 'content',
    });
  }, [dialog]);

  return (
    <>
      {holders}
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
export default UseDialog;
