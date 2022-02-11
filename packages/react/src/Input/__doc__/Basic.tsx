import React from 'react';
import { Input } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = React.useState<string>('12344');

  return (
    <div>
      <Input placeholder='Basic usage' type='password' value={value} onChange={handleValue} />
    </div>
  );
};

export default Demo;
