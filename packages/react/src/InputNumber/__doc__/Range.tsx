'use client';

import { InputNumber } from '@xl-vision/react';

const Demo = () => {
  return <InputNumber defaultValue={2} max={10} min={0} onChange={(v) => console.log(v)} />;
};

export default Demo;
