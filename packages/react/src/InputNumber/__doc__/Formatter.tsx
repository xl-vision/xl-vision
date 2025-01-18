'use client';

import { InputNumber } from '@xl-vision/react';

const Demo = () => {
  return (
    <InputNumber
      defaultValue={1000}
      formatter={(value) => (value ? `$ ${value}`.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
      parser={(value) => value.replaceAll(/\$\s?|(,*)/g, '')}
      onChange={(v) => console.log(v)}
    />
  );
};

export default Demo;
