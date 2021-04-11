/* eslint-disable no-console */
/* eslint-disable react/jsx-handler-names */
import { WarningOutlined } from '@xl-vision/icons';
import { Button, Dialog, Icon } from '@xl-vision/react';
import React from 'react';

export default () => {
  const handleClick = React.useCallback(() => {
    let i = 5;
    const { destroy, update } = Dialog.method({
      defaultVisible: true,
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
    <>
      <Button theme='primary' onClick={handleClick}>
        click
      </Button>
    </>
  );
};
