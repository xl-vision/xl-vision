import { BackTop } from '@xl-vision/react';
import React from 'react';

const Basic = () => {
  return (
    <>
      BackTop keeps showing
      <BackTop visibilityHeight={10} show={true} right={100} bottom={100} />
    </>
  );
};

export default Basic;
