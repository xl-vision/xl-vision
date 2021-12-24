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

const DisableRipple = () => {
  return (
    <Wrapper>
      <Button disableRipple={true}>button</Button>
      <Button variant='text' disableRipple={true} color='primary'>
        button
      </Button>
      <Button disableRipple={true} color='secondary'>
        button
      </Button>
      <Button variant='text' disableRipple={true} color='error'>
        button
      </Button>
      <Button variant='outlined' disableRipple={true} color='warning'>
        button
      </Button>
    </Wrapper>
  );
};

export default DisableRipple;
