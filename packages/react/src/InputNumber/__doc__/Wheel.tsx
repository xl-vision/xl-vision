'use client';

import { InputNumber } from '@xl-vision/react';

const Demo = () => {
  return <InputNumber defaultValue={2} wheel={true} onChange={(v) => console.log(v)} />;
};

export default Demo;
