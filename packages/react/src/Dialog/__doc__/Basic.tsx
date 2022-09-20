import { Button, Dialog } from '@xl-vision/react';

const Basic = () => {
  const [visible, setVisible] = useState(false);

  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);

  const handleConfirm = useCallback(() => {
    console.log('confirm');
  }, []);
  const handleCancel = useCallback(() => {
    console.log('cancel');
  }, []);

  return (
    <>
      <Button color='primary' onClick={handleClick}>
        click
      </Button>
      <Dialog
        title='Are you sure?'
        visible={visible}
        onVisibleChange={setVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores quidem fugiat
        aspernatur, odio, quo esse molestias porro maxime sit itaque quam soluta autem illo,
        corporis nihil alias sint tempora.
      </Dialog>
    </>
  );
};

export default Basic;
