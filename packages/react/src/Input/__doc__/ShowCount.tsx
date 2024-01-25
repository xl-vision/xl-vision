'use client';

import { Input } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <Input maxLength={20} placeholder='Basic usage' showCount={true} />
      <Input placeholder='Basic usage' showCount={true} style={{ marginTop: 20 }} />
    </div>
  );
};

export default Demo;
