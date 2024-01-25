'use client';

import { Textarea } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <Textarea
        allowClear={true}
        maxLength={20}
        placeholder='Default one row'
        rows={1}
        showCount={true}
      />
      <Textarea
        allowClear={true}
        maxLength={20}
        placeholder='Default mutiple rows'
        showCount={true}
        style={{ marginTop: 10 }}
      />
    </div>
  );
};

export default Demo;
