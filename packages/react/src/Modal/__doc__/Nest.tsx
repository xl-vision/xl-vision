import { useState } from 'react';
import { Button, Modal, styled } from '@xl-vision/react';

const Body = styled('div')(({ theme }) => {
  const { colors } = theme;
  return {
    backgroundColor: colors.background.paper,
    padding: '8px 16px',
    borderRadius: 4,
  };
});

const Nest = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <>
      <Button color='primary' onClick={() => setOpen1(true)}>
        show
      </Button>
      <Modal open={open1} onOpenChange={setOpen1}>
        <Body>
          <>
            <p>This is modal content</p>
            <Button onClick={() => setOpen2(true)}>show</Button>
            <Modal open={open2} onOpenChange={setOpen2}>
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
