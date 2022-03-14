import React from 'react';
import { TextArea } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = React.useState<string>();

  return (
    <div>
      <TextArea placeholder='Basic usage' value={value} onChange={handleValue} />
    </div>
  );
};

export default Demo;
