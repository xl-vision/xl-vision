'use client';

import { useCallback } from 'react';
import { Affix, Button, Message } from '@xl-vision/react';

const Demo = () => {
  const [message, holder] = Message.useMessage();

  const handleChange = useCallback(
    (affixed: boolean) => {
      message.info(`affix state change: ${affixed}`);
    },
    [message],
  );

  return (
    <>
      {holder}
      <Affix offsetTop={150} onChange={handleChange}>
        <Button>offset top 150</Button>
      </Affix>
    </>
  );
};

export default Demo;
