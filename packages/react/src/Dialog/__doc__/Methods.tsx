/* eslint-disable no-console */
/* eslint-disable react/jsx-handler-names */
import { Button, Dialog } from '@xl-vision/react';
import React from 'react';

export default () => {
  const handleClick = React.useCallback(() => {
    let i = 5;
    const { destroy, update } = Dialog.method({
      visible: true,
      title: 'This is a method dialog',
      children: `This dialog will close after ${i}s.`,
    });

    const timer = setInterval(() => {
      i--;

      if (i <= 0) {
        destroy();
        clearInterval(timer);
      } else {
        update({ children: `This dialog will close after ${i}s.` });
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
