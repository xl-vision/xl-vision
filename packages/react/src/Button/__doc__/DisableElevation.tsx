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

const DisableElevation = () => {
  return (
    <Wrapper>
      <Button disableElevation={true}>button</Button>
      <Button color='primary' disableElevation={true}>
        button
      </Button>
      <Button color='error' disableElevation={true}>
        button
      </Button>
      <Button color='warning' disableElevation={true}>
        button
      </Button>
    </Wrapper>
  );
};

export default DisableElevation;
