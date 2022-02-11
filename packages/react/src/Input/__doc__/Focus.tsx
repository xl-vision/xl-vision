import React from 'react';
import { Button, Input } from '@xl-vision/react';

const Demo = () => {
  const ref = React.useRef<HTMLSpanElement>(null);

  const handleClick = React.useCallback(() => {
    console.log(ref.current);
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
