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

const Basic = () => {
  return (
    <div>
      <Wrapper>
        <Button>default</Button>
        <Button color='primary'>primary</Button>
        <Button color='secondary'>secondary</Button>
        <Button color='info'>info</Button>
        <Button color='error'>error</Button>
        <Button color='warning'>warning</Button>
      </Wrapper>
      <Wrapper>
        <Button variant='text'>default</Button>
        <Button variant='text' color='primary'>
          primary
        </Button>
        <Button variant='text' color='secondary'>
          secondary
        </Button>
        <Button variant='text' color='info'>
          info
        </Button>
        <Button variant='text' color='error'>
          error
        </Button>
        <Button variant='text' color='warning'>
          warning
        </Button>
      </Wrapper>
      <Wrapper>
        <Button variant='outlined'>default</Button>
        <Button variant='outlined' color='primary'>
          primary
        </Button>
        <Button variant='outlined' color='secondary'>
          secondary
        </Button>
        <Button variant='outlined' color='info'>
          info
        </Button>
        <Button variant='outlined' color='error'>
          error
        </Button>
        <Button variant='outlined' color='warning'>
          warning
        </Button>
      </Wrapper>
    </div>
  );
};

export default Basic;
