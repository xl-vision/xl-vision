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

const Link = () => {
  return (
    <Wrapper>
      <Button href='#'>button</Button>
      <Button variant='text' href='#' color='primary'>
        button
      </Button>
      <Button href='#' color='secondary'>
        button
      </Button>
      <Button variant='text' href='#' color='error'>
        button
      </Button>
      <Button variant='outlined' href='#' color='warning'>
        button
      </Button>
      <Button href='#' disabled={true} color='primary'>
        disabled
      </Button>
    </Wrapper>
  );
};

export default Link;
