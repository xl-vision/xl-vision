import React from 'react';
import { Input } from '@xl-vision/react';

const { Password } = Input;

const Demo = () => {
  const [value, handleValue] = React.useState<string>();

  return (
    <div>
      <Password placeholder='password' value={value} onChange={handleValue} />
    </div>
  );
};

export default Demo;
