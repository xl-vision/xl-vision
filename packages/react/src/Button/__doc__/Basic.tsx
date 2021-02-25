import React from 'react';
import { Button } from '@xl-vision/react';

export default () => {
  return (
    <div className='container'>
      <Button>button</Button>
      <Button theme='primary'>button</Button>
      <Button theme='secondary'>button</Button>
      <Button theme='error'>button</Button>
      <Button theme='warning'>button</Button>
      <Button disabled={true} theme='primary'>
        disabled
      </Button>
    </div>
  );
};
