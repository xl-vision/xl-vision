import { TextArea } from '@xl-vision/react';
import { useState, useEffect } from 'react';

const Demo = () => {
  const [value, handleValue] = useState<string>();

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <TextArea placeholder='Basic usage' autoHeight={true} value={value} onChange={handleValue} />
      <TextArea
        style={{ marginTop: 10 }}
        placeholder='Basic usage'
        autoHeight={{ minRows: 3, maxRows: 6 }}
        value={value}
        onChange={handleValue}
      />
      <TextArea
        style={{ marginTop: 10 }}
        placeholder='Basic usage'
        autoHeight={{ minRows: 3 }}
        value={value}
        onChange={handleValue}
      />
    </div>
  );
};

export default Demo;
