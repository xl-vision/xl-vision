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
      <Button color='primary' href='#' variant='text'>
        button
      </Button>
      <Button color='error' href='#' variant='text'>
        button
      </Button>
      <Button color='warning' href='#' variant='outlined'>
        button
      </Button>
      <Button color='primary' disabled={true} href='#'>
        disabled
      </Button>
    </Wrapper>
  );
};

export default Link;
