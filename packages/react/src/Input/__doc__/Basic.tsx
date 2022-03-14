import React from 'react';
import { Input } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = React.useState<string>();

  React.useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <Input placeholder='Basic usage' value={value} onChange={handleValue} />
    </div>
  );
};

export default Demo;
