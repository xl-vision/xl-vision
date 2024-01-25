'use client';

import { BackTop } from '@xl-vision/react';

const Basic = () => {
  return (
    <>
      BackTop keeps showing
      <BackTop bottom={100} right={100} show={true} visibilityHeight={10} />
    </>
  );
};

export default Basic;
