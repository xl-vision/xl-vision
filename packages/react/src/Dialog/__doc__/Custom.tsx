/* eslint-disable react/jsx-handler-names */
import { CloseOutlined } from '@xl-vision/icons';
import { Button, Dialog, Icon, styled } from '@xl-vision/react';
import React from 'react';

const CustomHeader = styled('div')(({ theme }) => {
  const { typography, color } = theme;
  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${color.divider}`,
    margin: '-16px -24px',
    padding: '8px 8px 8px 24px',
    h6: {
      ...typography.h6,
      margin: 0,
      flex: 1,
    },
    button: {},
  };
});

const CustomFooter = styled('div')(({ theme }) => {
  const { color } = theme;
  return {
    borderTop: `1px solid ${color.divider}`,
    margin: -8,
    padding: 8,
  };
});

const Custom = () => {
  const [visible, setVisible] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setVisible(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setVisible(false);
  }, []);

  const title = (
    <CustomHeader>
      <h6>Custom Header</h6>
      <Button
        onClick={handleClose}
        className='close-btn'
        variant='text'
        prefixIcon={
          <Icon>
            <CloseOutlined />
          </Icon>
        }
      />
    </CustomHeader>
  );

  const footer = (
    <CustomFooter>
      <Button disableElevation={true} onClick={handleClose}>
        Cancel
      </Button>
      <Button
        color='primary'
        disableElevation={true}
        onClick={handleClose}
        style={{ marginRight: 8 }}
      >
        Submit
      </Button>
    </CustomFooter>
  );

  return (
    <>
      <Button color='primary' onClick={handleClick}>
        click
      </Button>
      <Dialog title={title} visible={visible} onVisibleChange={setVisible} footer={footer}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores quidem fugiat
        aspernatur, odio, quo esse molestias porro maxime sit itaque quam soluta autem illo,
        corporis nihil alias sint tempora.
      </Dialog>
    </>
  );
};

export default Custom;
