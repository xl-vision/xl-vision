import React from 'react';
import { ResizeObserver, ResizeObserverHandler, Input } from '@xl-vision/react';

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
      <Input readOnly={true} addonBefore='height' addonAfter='px' value={`${size.height}`} />
      <Input readOnly={true} addonBefore='width' addonAfter='px' value={`${size.width}`} />
      <ResizeObserver onResizeObserver={handleResize}>
        <textarea placeholder='drag me' />
      </ResizeObserver>
    </>
  );
};

export default Demo;
