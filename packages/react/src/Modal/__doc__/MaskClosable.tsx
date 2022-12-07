import { Button, Modal, styled } from '@xl-vision/react';
import { useState } from 'react';

const Body = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    backgroundColor: color.background.paper,
    padding: '8px 16px',
    borderRadius: 4,
  };
});

const MaskClosable = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button color='primary' onClick={() => setVisible(true)}>
        show
      </Button>
      <Modal maskClosable={false} visible={visible} onVisibleChange={setVisible}>
        <Body>
          <p>This is modal content</p>
        </Body>
      </Modal>
    </>
  );
};

export default MaskClosable;
