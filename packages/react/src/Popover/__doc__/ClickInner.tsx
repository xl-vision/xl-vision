import { Button, Popover } from '@xl-vision/react';
import { useState } from 'react';

const ClickInner = () => {
  const [visible, setVisible] = useState(false);

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

export default ClickInner;
