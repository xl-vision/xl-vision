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
