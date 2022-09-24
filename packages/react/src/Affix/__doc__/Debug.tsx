import { Affix, Button } from '@xl-vision/react';
import { useState } from 'react';

const Demo = () => {
  const [count, setCount] = useState(1);

  const content = [];

  for (let i = 0; i < count; i++) {
    content.push(
      <p style={{ backgroundColor: 'red' }} key={i}>
        content
      </p>,
    );
  }

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
