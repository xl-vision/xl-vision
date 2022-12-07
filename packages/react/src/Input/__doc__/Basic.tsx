import { useEffect, useState } from 'react';
import { Input } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = useState<string>();

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <Input placeholder='Basic usage' value={value} onChange={handleValue} />
    </div>
  );
};

export default Demo;
