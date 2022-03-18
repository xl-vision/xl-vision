import React from 'react';
import { TextArea } from '@xl-vision/react';

const Demo = () => {
  const [value, handleValue] = React.useState<string>();

  React.useEffect(() => {
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
