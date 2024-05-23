'use client';

import { Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    'button, a': {
      marginRight: 10,
      marginBottom: 10,
    },
  };
});

const EnableElevation = () => {
  return (
    <Wrapper>
      <Button enableElevation={true}>button</Button>
      <Button color='primary' enableElevation={true}>
        button
      </Button>
      <Button color='error' enableElevation={true}>
        button
      </Button>
      <Button color='warning' enableElevation={true}>
        button
      </Button>
    </Wrapper>
  );
};

export default EnableElevation;
