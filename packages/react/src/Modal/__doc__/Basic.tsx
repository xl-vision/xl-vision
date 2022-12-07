import { useState } from 'react';
import { Button, Modal, styled } from '@xl-vision/react';

const Body = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    backgroundColor: color.background.paper,
    padding: '8px 16px',
    borderRadius: 4,
  };
});

const Basic = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button color='primary' onClick={() => setVisible(true)}>
        show
      </Button>
      <Modal visible={visible} onVisibleChange={setVisible}>
        <Body>
          <p>This is modal content</p>
        </Body>
      </Modal>
    </>
  );
};

export default Basic;
