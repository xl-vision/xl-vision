import { useState, useEffect } from 'react';
import { TextArea } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = useState<string>();

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <TextArea placeholder='Basic usage' value={value} onChange={handleValue} />
    </div>
  );
};

export default Demo;
