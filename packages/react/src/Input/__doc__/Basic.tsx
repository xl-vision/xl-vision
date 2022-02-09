import React from 'react';
import { Input } from '@xl-vision/react';

const Basic = () => {
  const [value, handleValue] = React.useState('');

  return (
    <div>
      <Input placeholder='Basic usage' value={value} onChange={handleValue} maxLength={5} />
      <p>{value}</p>
    </div>
  );
};

export default Basic;
