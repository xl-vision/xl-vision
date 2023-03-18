import { useState, useEffect } from 'react';
import { Textarea } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = useState<string>();

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <Textarea placeholder='Basic usage' value={value} onChange={handleValue} />
    </div>
  );
};

export default Demo;
