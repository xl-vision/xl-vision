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

const Basic = () => {
  return (
    <div>
      <Wrapper>
        <Button>default</Button>
        <Button color='primary'>primary</Button>
        <Button color='info'>info</Button>
        <Button color='error'>error</Button>
        <Button color='warning'>warning</Button>
      </Wrapper>
      <Wrapper>
        <Button variant='text'>default</Button>
        <Button color='primary' variant='text'>
          primary
        </Button>
        <Button color='info' variant='text'>
          info
        </Button>
        <Button color='error' variant='text'>
          error
        </Button>
        <Button color='warning' variant='text'>
          warning
        </Button>
      </Wrapper>
      <Wrapper>
        <Button variant='outlined'>default</Button>
        <Button color='primary' variant='outlined'>
          primary
        </Button>
        <Button color='info' variant='outlined'>
          info
        </Button>
        <Button color='error' variant='outlined'>
          error
        </Button>
        <Button color='warning' variant='outlined'>
          warning
        </Button>
      </Wrapper>
    </div>
  );
};

export default Basic;
