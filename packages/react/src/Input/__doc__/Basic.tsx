import React from 'react';
import { Input } from '@xl-vision/react';

const Basic = () => {
  const [value, handleValue] = React.useState('');

  return (
    <div>
      <Input
        placeholder='Basic usage'
        value={value}
        onChange={handleValue}
        maxLength={5}
        showCount={true}
      />
      <p>{value}</p>
    </div>
  );
};

export default Basic;
