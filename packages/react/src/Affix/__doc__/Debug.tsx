'use client';

import React, { useMemo, useState } from 'react';
import { Affix, Button } from '@xl-vision/react';

const Demo = () => {
  const [count, setCount] = useState(1);

  const content = useMemo(() => {
    const arr: Array<React.ReactNode> = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        <p key={i} style={{ backgroundColor: 'red' }}>
          content
        </p>,
      );
    }

    return arr;
  }, [count]);

  return (
    <>
      <Button onClick={() => setCount((prev) => prev + 1)}>click</Button>
      {/* <Affix target={target} offsetTop={80}>
        <div>{content}</div>
      </Affix> */}
      <Affix offsetTop={100}>{content}</Affix>
    </>
  );
};

export default Demo;
