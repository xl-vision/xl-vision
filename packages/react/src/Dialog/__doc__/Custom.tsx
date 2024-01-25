'use client';

import { CloseOutlined } from '@xl-vision/icons';
import { useState, useCallback } from 'react';
import { Button, Dialog, styled } from '@xl-vision/react';

const CustomHeader = styled('div')(({ theme }) => {
  const { typography, colors, sizes } = theme;
  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `${sizes.middle.border}px solid ${colors.divider.primary}`,
    margin: '-16px -24px',
    padding: '8px 8px 8px 24px',
    h6: {
      ...typography.h6.style,
      margin: 0,
      flex: 1,
    },
    button: {},
  };
});

const CustomFooter = styled('div')(({ theme }) => {
  const { colors, sizes } = theme;
  return {
    borderTop: `${sizes.middle.border}px solid ${colors.divider.primary}`,
    margin: -8,
    padding: 8,
  };
});

const Custom = () => {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const title = (
    <CustomHeader>
      <h6>Custom Header</h6>
      <Button
        className='close-btn'
        prefixIcon={<CloseOutlined />}
        variant='text'
        onClick={handleClose}
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
        style={{ marginRight: 8 }}
        onClick={handleClose}
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
      <Dialog footer={footer} open={open} title={title} onOpenChange={setOpen}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores quidem fugiat
        aspernatur, odio, quo esse molestias porro maxime sit itaque quam soluta autem illo,
        corporis nihil alias sint tempora.
      </Dialog>
    </>
  );
};

export default Custom;
