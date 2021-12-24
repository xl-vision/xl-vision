import React from 'react';
import { Tooltip, Button } from '@xl-vision/react';

const Arrow = () => {
  return (
    <Tooltip placement='top' showArrow={true} content='this is a tooltip' maxWidth={200}>
      <Button color='primary'>button</Button>
    </Tooltip>
  );
};

export default Arrow;
