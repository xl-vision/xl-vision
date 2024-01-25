'use client';

import { ToTopOutlined } from '@xl-vision/icons';
import { BackTop, Button } from '@xl-vision/react';

const Basic = () => {
  return (
    <>
      Scroll down to see the bottom-right blue button.
      <BackTop bottom={100} right={60} visibilityHeight={10}>
        <Button color='primary' prefixIcon={<ToTopOutlined />} round={true} />
      </BackTop>
    </>
  );
};

export default Basic;
