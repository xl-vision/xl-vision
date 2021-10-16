/* eslint-disable react/jsx-handler-names */
import { Button, Dialog } from '@xl-vision/react';
import React from 'react';

export default () => {
  const [visible, setVisible] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setVisible(true);
  }, []);

  const handleConfirm = React.useCallback(() => {
    console.log('confirm');
  }, []);
  const handleCancel = React.useCallback(() => {
    console.log('cancel');
  }, []);

  return (
    <>
      <Button theme='primary' onClick={handleClick}>
        click
      </Button>
      <Dialog
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
