/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Button, Modal } from '@xl-vision/react';

export default () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)}>show</Button>
      <Modal visible={visible} onVisibleChange={setVisible}>
        <p>This is modal content</p>
      </Modal>
    </>
  );
};
