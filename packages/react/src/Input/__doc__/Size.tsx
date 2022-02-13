import React from 'react';
import { Input } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = React.useState<string>();

  return (
    <div>
      <Input size='small' placeholder='Basic usage' value={value} onChange={handleValue} />{' '}
      <Input
        size='middle'
        style={{ marginTop: 10 }}
        placeholder='Basic usage'
        value={value}
        onChange={handleValue}
      />
      <Input
        style={{ marginTop: 10 }}
        size='large'
        placeholder='Basic usage'
        value={value}
        onChange={handleValue}
      />
    </div>
  );
};

export default Demo;
