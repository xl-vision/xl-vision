import React from 'react';
import { Button, Icon, styled } from '@xl-vision/react';
import { SearchOutlined } from '@xl-vision/icons';

const IconWrapper = (
  <Icon>
    <SearchOutlined />
  </Icon>
);

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
    <div>
      <Wrapper>
        <Button>button</Button>
        <Button color='primary'>button</Button>
        <Button color='secondary'>button</Button>
        <Button color='error'>button</Button>
        <Button round={true} color='warning'>
          button
        </Button>
        <Button color='primary' prefixIcon={IconWrapper}>
          button
        </Button>
        <Button color='primary' prefixIcon={IconWrapper} round={true} />
      </Wrapper>
      <Wrapper>
        <Button variant='text'>button</Button>
        <Button variant='text' color='primary'>
          button
        </Button>
        <Button variant='text' color='secondary'>
          button
        </Button>
        <Button variant='text' color='error'>
          button
        </Button>
        <Button round={true} variant='text' color='warning'>
          button
        </Button>
        <Button variant='text' color='primary' prefixIcon={IconWrapper}>
          button
        </Button>
        <Button color='primary' prefixIcon={IconWrapper} round={true} />
      </Wrapper>
      <Wrapper>
        <Button variant='outlined'>button</Button>
        <Button variant='outlined' color='primary'>
          button
        </Button>
        <Button variant='outlined' color='secondary'>
          button
        </Button>
        <Button variant='outlined' color='error'>
          button
        </Button>
        <Button round={true} variant='outlined' color='warning'>
          button
        </Button>
        <Button variant='outlined' color='primary' prefixIcon={IconWrapper}>
          button
        </Button>
        <Button color='primary' prefixIcon={IconWrapper} round={true} />
      </Wrapper>
    </div>
  );
};
