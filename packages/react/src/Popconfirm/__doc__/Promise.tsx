'use client';

import { useCallback } from 'react';
import { Popconfirm, Button } from '@xl-vision/react';

const Demo = () => {
  const handleConfirm = useCallback(() => {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 2000);
    });
  }, []);

  return (
    <div>
      <Popconfirm title='Are you sure to do it?' onConfirm={handleConfirm}>
        <Button color='primary'>button</Button>
      </Popconfirm>
    </div>
  );
};

export default Demo;
