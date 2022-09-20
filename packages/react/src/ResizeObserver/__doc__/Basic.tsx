import { ResizeObserver, ResizeObserverHandler, Input } from '@xl-vision/react';
import { useState, useCallback } from 'react';

const Demo = () => {
  const [size, setSize] = useState<{ height: number; width: number }>({
    width: 0,
    height: 0,
  });

  const handleResize: ResizeObserverHandler = useCallback((state) => {
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
