/* eslint-disable react/jsx-handler-names */
import { Button, Popover } from '@xl-vision/react';
import React from 'react';

export default () => {
  const [visible, setVisible] = React.useState(false);

  const content = (
    <Button variant='text' onClick={() => setVisible(false)} color='primary'>
      close
    </Button>
  );

  return (
    <Popover
      trigger='click'
      visible={visible}
      onVisibleChange={setVisible}
      title='title'
      content={content}
    >
      <Button color='primary'>click</Button>
    </Popover>
  );
};
