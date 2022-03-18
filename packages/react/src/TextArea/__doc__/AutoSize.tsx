import React from 'react';
import { TextArea } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = React.useState<string>();

  React.useEffect(() => {
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
