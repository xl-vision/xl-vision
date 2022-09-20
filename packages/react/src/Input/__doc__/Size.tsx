import { Input } from '@xl-vision/react';
import { useState } from 'react';

const Demo = () => {
  const [value, handleValue] = useState<string>();

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
