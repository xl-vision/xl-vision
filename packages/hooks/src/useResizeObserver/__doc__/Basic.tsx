'use client';

import { useCallback, useState } from 'react';
import { useResizeObserver } from '@xl-vision/hooks';

const Basic = () => {
  const [state, setState] = useState<{ width: number; height: number }>();

  const ref = useResizeObserver(
    useCallback((s) => {
      setState(s);
    }, []),
  );

  return (
    <div>
      <textarea ref={ref}></textarea>
      {JSON.stringify(state)}
    </div>
  );
};

export default Basic;
