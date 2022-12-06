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
      <Input addonAfter='px' addonBefore='height' readOnly={true} value={`${size.height}`} />
      <Input addonAfter='px' addonBefore='width' readOnly={true} value={`${size.width}`} />
      <ResizeObserver onResizeObserver={handleResize}>
        <textarea placeholder='drag me' />
      </ResizeObserver>
    </>
  );
};

export default Demo;
