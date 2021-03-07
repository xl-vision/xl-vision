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
      <Button href='#'>button</Button>
      <Button variant='text' href='#' theme='primary'>
        button
      </Button>
      <Button href='#' theme='secondary'>
        button
      </Button>
      <Button variant='text' href='#' theme='error'>
        button
      </Button>
      <Button variant='outlined' href='#' theme='warning'>
        button
      </Button>
      <Button href='#' disabled={true} theme='primary'>
        disabled
      </Button>
    </Wrapper>
  );
};
