import { useState, useEffect } from 'react';
import { Textarea } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = useState<string>();

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <Textarea autoHeight={true} placeholder='Basic usage' value={value} onChange={handleValue} />
      <Textarea
        autoHeight={{ minRows: 3, maxRows: 6 }}
        placeholder='Basic usage'
        style={{ marginTop: 10 }}
        value={value}
        onChange={handleValue}
      />
      <Textarea
        autoHeight={{ minRows: 3 }}
        placeholder='Basic usage'
        style={{ marginTop: 10 }}
        value={value}
        onChange={handleValue}
      />
    </div>
  );
};

export default Demo;
