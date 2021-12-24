import React from 'react';
import { Popconfirm, Button } from '@xl-vision/react';

const Basic = () => {
  return (
    <div>
      <Popconfirm title='Are you sure to do it?'>
        <Button color='primary'>button</Button>
      </Popconfirm>
    </div>
  );
};

export default Basic;
