import React from 'react';
import { ResizeObserver, ResizeObserverHandler, TextArea, Input } from '@xl-vision/react';

const Demo = () => {
  const [size, setSize] = React.useState<{ height: number; width: number }>({
    width: 0,
    height: 0,
  });

  const handleResize: ResizeObserverHandler = React.useCallback((state) => {
    setSize(state);
  }, []);

  return (
    <>
      <Input.Group>
        <Input prefix='height' value={`${size.height}`} />
        <Input prefix='width' value={`${size.width}`} />
      </Input.Group>
      <ResizeObserver onResizeObserver={handleResize}>
        <TextArea />
      </ResizeObserver>
    </>
  );
};

export default Demo;
