import { Button, Dialog } from '@xl-vision/react';
import { useState, useCallback } from 'react';

const PromiseComponent = () => {
  const [visible, setVisible] = useState(false);

  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);

  const handleConfirm = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        reject();
      }, 3000);
    });
  }, []);
  const handleCancel = useCallback(() => {
    console.log('cancel');
  }, []);

  return (
    <>
      <Button color='primary' onClick={handleClick}>
        click
      </Button>
      <Dialog
        escClosable={false}
        maskClosable={false}
        title='Are you sure?'
        visible={visible}
        onVisibleChange={setVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores quidem fugiat
        aspernatur, odio, quo esse molestias porro maxime sit itaque quam soluta autem illo,
        corporis nihil alias sint tempora.
      </Dialog>
    </>
  );
};

export default PromiseComponent;
