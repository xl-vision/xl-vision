import React from 'react';
import { Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    ':not(:last-child)': {
      marginBottom: 10,
    },
    'button, a': {
      ':not(:last-child)': {
        marginRight: 10,
      },
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
