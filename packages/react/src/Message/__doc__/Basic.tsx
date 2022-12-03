import { Button, Message } from '@xl-vision/react';
import { useCallback } from 'react';

const Demo = () => {
  const handleOpen = useCallback(() => {
    Message.info({ content: 'hello world' });
  }, []);

  return (
    <div>
      <Button onClick={handleOpen}>INFO</Button>
    </div>
  );
};

export default Demo;
