import React from 'react';
import { Popconfirm, Button } from '@xl-vision/react';

export default () => {
  return (
    <div>
      <Popconfirm title='Are you sure to do it?'>
        <Button theme='primary'>TS</Button>
      </Popconfirm>
    </div>
  );
};
