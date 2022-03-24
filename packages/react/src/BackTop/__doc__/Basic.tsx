import { BackTop } from '@xl-vision/react';
import React from 'react';

const Basic = () => {
  return (
    <>
      Scroll down to see the bottom-right gray button.
      <BackTop visibilityHeight={10} right={60} />
    </>
  );
};

export default Basic;
