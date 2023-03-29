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
      <Button color='primary' disableRipple={true} variant='text'>
        button
      </Button>
      <Button color='error' disableRipple={true} variant='text'>
        button
      </Button>
      <Button color='warning' disableRipple={true} variant='outlined'>
        button
      </Button>
    </Wrapper>
  );
};

export default DisableRipple;
