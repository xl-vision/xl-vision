'use client';

import { useState } from 'react';
import { Button, Modal, Popper, styled } from '@xl-vision/react';

const Body = styled('div')(({ theme }) => {
  const { colors } = theme;
  return {
    backgroundColor: colors.background.paper,
    padding: '8px 16px',
    borderRadius: 4,
    border: `1px solid ${colors.divider.primary}`,
  };
});

const Shortcut = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color='primary' onClick={() => setOpen(true)}>
        show
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <Body>
          <p>Please click button and try to press key tab</p>
          <Popper
            placement='bottom'
            popup={
              <Body>
                <Popper
                  placement='bottom'
                  popup={
                    <Body>
                      <span>popper content</span>
                    </Body>
                  }
                  trigger='click'
                >
                  <Button>Button</Button>
                </Popper>
              </Body>
            }
            trigger='click'
          >
            <Button>Button</Button>
          </Popper>
        </Body>
      </Modal>
    </>
  );
};

export default Shortcut;
