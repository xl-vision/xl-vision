/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Button, Modal, Popper, styled } from '@xl-vision/react';

const Body = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    backgroundColor: color.background.paper,
    padding: '8px 16px',
    borderRadius: 4,
    border: `1px solid ${color.divider}`,
  };
});

const Shortcut = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button color='primary' onClick={() => setVisible(true)}>
        show
      </Button>
      <Modal visible={visible} onVisibleChange={setVisible}>
        <Body>
          <p>Please click button and try to press key tab</p>
          <Popper
            placement='bottom'
            trigger='click'
            popup={
              <Body>
                <Popper
                  placement='bottom'
                  trigger='click'
                  popup={
                    <Body>
                      <span>popper content</span>
                    </Body>
                  }
                >
                  <Button>Button</Button>
                </Popper>
              </Body>
            }
          >
            <Button>Button</Button>
          </Popper>
        </Body>
      </Modal>
    </>
  );
};

export default Shortcut;
