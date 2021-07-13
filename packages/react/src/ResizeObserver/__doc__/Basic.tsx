/* eslint-disable no-console */
import React from 'react';
import { ResizeObserver } from '@xl-vision/react';

export default () => {
  const handleResize = React.useCallback((props) => {
    console.log(props);
  }, []);

  return (
    <ResizeObserver onResize={handleResize}>
      <textarea />
    </ResizeObserver>
  );
};
