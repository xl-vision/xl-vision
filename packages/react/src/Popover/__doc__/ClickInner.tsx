import { Button, Popover } from '@xl-vision/react';
import { useState } from 'react';

const ClickInner = () => {
  const [visible, setVisible] = useState(false);

  const content = (
    <Button color='primary' variant='text' onClick={() => setVisible(false)}>
      close
    </Button>
  );

  return (
    <Popover
      content={content}
      title='title'
      trigger='click'
      visible={visible}
      onVisibleChange={setVisible}
    >
      <Button color='primary'>click</Button>
    </Popover>
  );
};

export default ClickInner;
