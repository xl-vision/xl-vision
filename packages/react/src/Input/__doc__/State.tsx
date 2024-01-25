'use client';

import { Input } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <Input disabled={true} placeholder='Basic usage' value='disabled content' />
      <Input
        placeholder='Basic usage'
        readOnly={true}
        style={{ marginTop: 10 }}
        value='readonly content'
      />
    </div>
  );
};

export default Demo;
