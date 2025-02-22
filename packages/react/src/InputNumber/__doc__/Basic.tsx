'use client';

import { InputNumber } from '@xl-vision/react';

const Demo = () => {
  return <InputNumber defaultValue={3} precision={2} onChange={(v) => console.log(v)} />;
};

export default Demo;
