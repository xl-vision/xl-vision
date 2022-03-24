import { ToTopOutlined } from '@xl-vision/icons';
import { BackTop, Button } from '@xl-vision/react';
import React from 'react';

const Basic = () => {
  return (
    <>
      Scroll down to see the bottom-right blue button.
      <BackTop visibilityHeight={10} right={60} bottom={100}>
        <Button color='primary' round={true} prefixIcon={<ToTopOutlined />} />
      </BackTop>
    </>
  );
};

export default Basic;
