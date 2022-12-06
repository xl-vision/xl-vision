import { CloseOutlined } from '@xl-vision/icons';
import { Button, Dialog, styled } from '@xl-vision/react';
import { useState, useCallback } from 'react';

const CustomHeader = styled('div')(({ theme }) => {
  const { typography, color, styleSize } = theme;
  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `${styleSize.middle.border}px solid ${color.divider}`,
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
  const { color, styleSize } = theme;
  return {
    borderTop: `${styleSize.middle.border}px solid ${color.divider}`,
    margin: -8,
    padding: 8,
  };
});

const Custom = () => {
  const [visible, setVisible] = useState(false);

  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
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
      <Dialog footer={footer} title={title} visible={visible} onVisibleChange={setVisible}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores quidem fugiat
        aspernatur, odio, quo esse molestias porro maxime sit itaque quam soluta autem illo,
        corporis nihil alias sint tempora.
      </Dialog>
    </>
  );
};

export default Custom;
