'use client';

import { InputNumber } from '@xl-vision/react';

const Demo = () => {
  return (
    <InputNumber
      defaultValue={'1000000000000000000000.1'}
      highPrecisionMode={true}
      onChange={(v) => console.log(v)}
    />
  );
};

export default Demo;
