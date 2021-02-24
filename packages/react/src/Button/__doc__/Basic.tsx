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
      <br />
      <Button disabled={true}>button</Button>
      <Button disabled={true} theme='primary'>
        button
      </Button>
      <Button disabled={true} theme='secondary'>
        button
      </Button>
      <Button disabled={true} theme='error'>
        button
      </Button>
      <Button disabled={true} theme='warning'>
        button
      </Button>
    </div>
  );
};
