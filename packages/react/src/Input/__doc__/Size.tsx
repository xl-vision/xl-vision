import { Input } from '@xl-vision/react';
import { useState } from 'react';

const Demo = () => {
  const [value, handleValue] = useState<string>();

  return (
    <div>
      <Input placeholder='Basic usage' size='small' value={value} onChange={handleValue} />{' '}
      <Input
        placeholder='Basic usage'
        size='middle'
        style={{ marginTop: 10 }}
        value={value}
        onChange={handleValue}
      />
      <Input
        placeholder='Basic usage'
        size='large'
        style={{ marginTop: 10 }}
        value={value}
        onChange={handleValue}
      />
    </div>
  );
};

export default Demo;
