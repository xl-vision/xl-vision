'use client';

import { useRef, useCallback } from 'react';
import { Button, Input, InputInstance } from '@xl-vision/react';

const Demo = () => {
  const ref = useRef<InputInstance>(null);

  const handleClick = useCallback(() => {
    ref.current?.focus();
  }, []);

  return (
    <div>
      <Input placeholder='Basic usage' ref={ref} />
      <Button color='primary' style={{ marginTop: 10 }} onClick={handleClick}>
        focus input
      </Button>
    </div>
  );
};

export default Demo;
