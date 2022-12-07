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

const Nest = () => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  return (
    <>
      <Button color='primary' onClick={() => setVisible1(true)}>
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

export default Nest;
