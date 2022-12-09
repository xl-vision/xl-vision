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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color='primary' onClick={() => setOpen(true)}>
        show
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <Body>
          <p>This is modal content</p>
        </Body>
      </Modal>
    </>
  );
};

export default Basic;
