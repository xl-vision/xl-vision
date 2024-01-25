'use client';

import { Input } from '@xl-vision/react';

const Demo = () => {
  return (
    <Input
      allowClear={true}
      maxLength={20}
      placeholder='Basic usage'
      showCount={true}
      suffix='RMB'
    />
  );
};

export default Demo;
