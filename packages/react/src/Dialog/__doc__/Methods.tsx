import { WarningOutlined } from '@xl-vision/icons';
import { Button, Dialog } from '@xl-vision/react';
import { useCallback } from 'react';

const Methods = () => {
  const handleClick = useCallback(() => {
    let i = 5;
    const { destroy, update, isDestoryed } = Dialog.open({
      title: 'This is a method dialog',
      content: `This dialog will close after ${i}s.`,
      icon: <WarningOutlined />,
    });

    const timer = setInterval(() => {
      i--;

      if (i <= 0) {
        destroy();
        clearInterval(timer);
      } else if (!isDestoryed()) {
        update({ content: `This dialog will close after ${i}s.` });
      }
    }, 1000);
  }, []);

  return (
    <Button color='primary' onClick={handleClick}>
      click
    </Button>
  );
};

export default Methods;
