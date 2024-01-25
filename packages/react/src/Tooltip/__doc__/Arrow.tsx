'use client';

import { Tooltip, Button } from '@xl-vision/react';

const Arrow = () => {
  return (
    <Tooltip content='this is a tooltip' hideArrow={true} maxWidth={200} placement='top'>
      <Button color='primary'>button</Button>
    </Tooltip>
  );
};

export default Arrow;
