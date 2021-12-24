import React from 'react';
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
      <Button disableElevation={true} color='primary'>
        button
      </Button>
      <Button disableElevation={true} color='secondary'>
        button
      </Button>
      <Button disableElevation={true} color='error'>
        button
      </Button>
      <Button disableElevation={true} color='warning'>
        button
      </Button>
    </Wrapper>
  );
};

export default DisableElevation;
