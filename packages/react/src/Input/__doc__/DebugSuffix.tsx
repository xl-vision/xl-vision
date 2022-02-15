import React from 'react';
import { Input } from '@xl-vision/react';

const Demo = () => {
  return (
    <Input
      placeholder='Basic usage'
      maxLength={20}
      showCount={true}
      suffix='RMB'
      allowClear={true}
    />
  );
};

export default Demo;
