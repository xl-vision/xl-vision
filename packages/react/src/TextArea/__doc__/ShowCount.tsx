import React from 'react';
import { TextArea } from '@xl-vision/react';

const Demo = () => {
  return (
    <div>
      <TextArea
        placeholder='Basic usage'
        rows={1}
        allowClear={true}
        showCount={true}
      />
      <TextArea
        placeholder='Basic usage'
        allowClear={true}
        maxLength={20}
        showCount={true}
        style={{ marginTop: 10 }}
      />
    </div>
  );
};

export default Demo;
