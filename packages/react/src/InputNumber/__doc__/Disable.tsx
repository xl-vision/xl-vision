'use client';

import { InputNumber } from '@xl-vision/react';

const Demo = () => {
  return (
    <>
      <InputNumber defaultValue={100} disabled={true} onChange={(v) => console.log(v)} />
      <InputNumber defaultValue={100} readOnly={true} onChange={(v) => console.log(v)} />
    </>
  );
};

export default Demo;
