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

export default () => {
  return (
    <Wrapper>
      <Button disableElevation={true}>button</Button>
      <Button disableElevation={true} theme='primary'>
        button
      </Button>
      <Button disableElevation={true} theme='secondary'>
        button
      </Button>
      <Button disableElevation={true} theme='error'>
        button
      </Button>
      <Button disableElevation={true} theme='warning'>
        button
      </Button>
    </Wrapper>
  );
};
