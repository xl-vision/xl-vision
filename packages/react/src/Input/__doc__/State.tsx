import React from 'react';
import { Input } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <Input placeholder='Basic usage' value='disabled content' disabled={true} />
      <Input
        placeholder='Basic usage'
        value='readonly content'
        readOnly={true}
        style={{ marginTop: 10 }}
      />
    </div>
  );
};

export default Demo;
