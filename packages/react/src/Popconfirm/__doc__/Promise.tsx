import { Popconfirm, Button } from '@xl-vision/react';
import { useCallback } from 'react';

const Demo = () => {
  const handleConfirm = useCallback(() => {
    return new Promise((resolve) => {
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
