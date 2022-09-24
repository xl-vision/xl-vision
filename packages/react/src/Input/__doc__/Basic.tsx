import { Input } from '@xl-vision/react';
import { useEffect, useState } from 'react';

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
