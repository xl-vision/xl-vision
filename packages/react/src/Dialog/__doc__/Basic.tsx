/* eslint-disable react/jsx-handler-names */
import { Button, Dialog } from '@xl-vision/react';
import React from 'react';

export default () => {
  const [visible, setVisible] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setVisible(true);
  }, []);

  return (
    <>
      <Button theme='primary' onClick={handleClick}>
        click
      </Button>
      <Dialog title='This is a demo' visible={visible} onVisibleChange={setVisible}>
        <div>This is dialog content</div>
      </Dialog>
    </>
  );
};
