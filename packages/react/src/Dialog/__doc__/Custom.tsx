import { CloseOutlined } from '@xl-vision/icons';
import { Button, Dialog, styled } from '@xl-vision/react';

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
        onClick={handleClose}
        className='close-btn'
        variant='text'
        prefixIcon={<CloseOutlined />}
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
