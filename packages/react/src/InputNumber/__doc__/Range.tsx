'use client';

import { InputNumber } from '@xl-vision/react';

const Demo = () => {
  return <InputNumber max={10} min={0} onChange={(v) => console.log(v)} />;
};

export default Demo;
