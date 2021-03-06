import React from 'react';
import { Tooltip, Button } from '@xl-vision/react';

export default () => {
  return (
    <Tooltip placement='top' showArrow={true} content='this is a tooltip' maxWidth={200}>
      <Button theme='primary'>button</Button>
    </Tooltip>
  );
};
