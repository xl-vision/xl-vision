import React from 'react';
import { Input } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = React.useState<string>();

  return (
    <div>
      <Input placeholder='Basic usage' value={value} onChange={handleValue} />
    </div>
  );
};

export default Demo;
