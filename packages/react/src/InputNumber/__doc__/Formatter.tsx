'use client';

import { InputNumber } from '@xl-vision/react';

const Demo = () => {
  return (
    <InputNumber
      defaultValue={1000}
      formatter={(value) => (value ? `$ ${value}`.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
      parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
      onChange={(v) => console.log(v)}
    />
  );
};

export default Demo;
