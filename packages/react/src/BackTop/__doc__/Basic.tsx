import { BackTop } from '@xl-vision/react';

const Basic = () => {
  return (
    <>
      Scroll down to see the bottom-right gray button.
      <BackTop right={60} visibilityHeight={10} />
    </>
  );
};

export default Basic;
