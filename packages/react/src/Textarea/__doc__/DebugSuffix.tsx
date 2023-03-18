import { useState, useEffect } from 'react';
import { Textarea } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = useState<string>();

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <Textarea
        allowClear={true}
        autoHeight={true}
        maxLength={20}
        placeholder='Basic usage'
        showCount={true}
        value={value}
        onChange={handleValue}
      />
    </div>
  );
};

export default Demo;
