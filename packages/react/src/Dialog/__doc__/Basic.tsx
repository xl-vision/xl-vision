import { useState, useCallback } from 'react';
import { Button, Dialog, Message } from '@xl-vision/react';

const Basic = () => {
  const [visible, setVisible] = useState(false);
  const [message, holder] = Message.useMessage();

  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);

  const handleConfirm = useCallback(() => {
    message.info(`confirm`);
  }, [message]);
  const handleCancel = useCallback(() => {
    message.info(`cancel`);
  }, [message]);

  return (
    <>
      {holder}
      <Button color='primary' onClick={handleClick}>
        click
      </Button>
      <Dialog
        title='Are you sure?'
        visible={visible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onVisibleChange={setVisible}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores quidem fugiat
        aspernatur, odio, quo esse molestias porro maxime sit itaque quam soluta autem illo,
        corporis nihil alias sint tempora.
      </Dialog>
    </>
  );
};

export default Basic;
