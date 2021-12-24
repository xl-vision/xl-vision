import { WarningOutlined } from '@xl-vision/icons';
import { Button, Dialog, Icon } from '@xl-vision/react';
import React from 'react';

const Methods = () => {
  const handleClick = React.useCallback(() => {
    let i = 5;
    const { destroy, update } = Dialog.open({
      title: 'This is a method dialog',
      content: `This dialog will close after ${i}s.`,
      icon: (
        <Icon>
          <WarningOutlined />
        </Icon>
      ),
    });

    const timer = setInterval(() => {
      i--;

      if (i <= 0) {
        destroy();
        clearInterval(timer);
      } else {
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
