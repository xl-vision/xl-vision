import { TextArea } from '@xl-vision/react';
import { useState, useEffect } from 'react';

const Demo = () => {
  const [value, handleValue] = useState<string>();

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <TextArea
        placeholder='Basic usage'
        value={value}
        onChange={handleValue}
        allowClear={true}
        maxLength={20}
        showCount={true}
        autoHeight={true}
      />
    </div>
  );
};

export default Demo;
