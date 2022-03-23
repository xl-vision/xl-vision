import React from 'react';
import { Affix, Button } from '@xl-vision/react';

const Demo = () => {
  const [content, setContent] = React.useState('offset');

  const target = React.useCallback(() => {
    return document.querySelector('main')?.parentElement || window;
  }, []);

  return (
    <>
      <Button onClick={() => setContent((prev) => prev + prev)}>click</Button>
      <Affix target={target} offsetTop={80}>
        <Button>{content}</Button>
      </Affix>
    </>
  );
};

export default Demo;
