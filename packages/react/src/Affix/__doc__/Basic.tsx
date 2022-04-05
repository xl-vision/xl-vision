import React from 'react';
import { Affix, Button } from '@xl-vision/react';

const Demo = () => {
  return (
    <>
      <Affix offsetTop={100}>
        <Button>offset top 100</Button>
      </Affix>
      <Affix offsetBottom={100}>
        <Button>offset bottom 100</Button>
      </Affix>
    </>
  );
};

export default Demo;
