import { Button, Input } from '@xl-vision/react';
import { useRef, useCallback } from 'react';

const Demo = () => {
  const ref = useRef<HTMLSpanElement>(null);

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
