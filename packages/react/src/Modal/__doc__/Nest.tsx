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
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);

  return (
    <>
      <Button theme='primary' onClick={() => setVisible1(true)}>
        show
      </Button>
      <Modal visible={visible1} onVisibleChange={setVisible1}>
        <Body>
          <>
            <p>This is modal content</p>
            <Button onClick={() => setVisible2(true)}>show</Button>
            <Modal visible={visible2} onVisibleChange={setVisible2}>
              <Body>
                <p>This is modal content</p>
              </Body>
            </Modal>
          </>
        </Body>
      </Modal>
    </>
  );
};
