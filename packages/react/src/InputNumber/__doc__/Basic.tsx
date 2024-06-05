'use client';

import { InputNumber } from '@xl-vision/react';

const Demo = () => {
  return <InputNumber onChange={(v) => console.log(v)} precision={2} />;
};

export default Demo;
