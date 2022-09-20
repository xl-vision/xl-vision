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

const HideMask = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button color='primary' onClick={() => setVisible(true)}>
        show
      </Button>
      <Modal visible={visible} onVisibleChange={setVisible} mask={false}>
        <Body>
          <p>This is modal content</p>
        </Body>
      </Modal>
    </>
  );
};
export default HideMask;
