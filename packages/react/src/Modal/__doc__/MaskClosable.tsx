/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Button, Modal, styled } from '@xl-vision/react';

const Body = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    backgroundColor: color.background.paper,
    padding: '8px 16px',
    borderRadius: 4,
  };
});

export default () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)}>show</Button>
      <Modal visible={visible} onVisibleChange={setVisible} maskClosable={false}>
        <Body>
          <p>This is modal content</p>
        </Body>
      </Modal>
    </>
  );
};
