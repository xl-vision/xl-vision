import { Input } from '@xl-vision/react';
import { useState } from 'react';

const { Password } = Input;

const Demo = () => {
  const [value, handleValue] = useState<string>();

  return (
    <div>
      <Password placeholder='password' value={value} onChange={handleValue} />
    </div>
  );
};

export default Demo;
