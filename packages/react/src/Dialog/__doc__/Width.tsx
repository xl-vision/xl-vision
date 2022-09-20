import { Button, Dialog } from '@xl-vision/react';

const Width = () => {
  const [visible, setVisible] = useState(false);

  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);

  return (
    <>
      <Button color='primary' onClick={handleClick}>
        click
      </Button>
      <Dialog
        confirmText='Turn on the switch'
        cancelText='Cancel'
        title='Are you sure?'
        visible={visible}
        onVisibleChange={setVisible}
        style={{
          width: 250,
        }}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod maiores quidem fugiat
        aspernatur, odio, quo esse molestias porro maxime sit itaque quam soluta autem illo,
        corporis nihil alias sint tempora.
      </Dialog>
    </>
  );
};

export default Width;
