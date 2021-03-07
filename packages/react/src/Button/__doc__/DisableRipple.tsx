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
      <Button disableRipple={true}>button</Button>
      <Button variant='text' disableRipple={true} theme='primary'>
        button
      </Button>
      <Button disableRipple={true} theme='secondary'>
        button
      </Button>
      <Button variant='text' disableRipple={true} theme='error'>
        button
      </Button>
      <Button variant='outlined' disableRipple={true} theme='warning'>
        button
      </Button>
    </Wrapper>
  );
};
