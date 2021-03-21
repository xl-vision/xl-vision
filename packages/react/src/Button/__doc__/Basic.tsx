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
        <Button theme='primary'>button</Button>
        <Button theme='secondary'>button</Button>
        <Button theme='error'>button</Button>
        <Button round={true} theme='warning'>
          button
        </Button>
        <Button theme='primary' prefixIcon={IconWrapper}>
          button
        </Button>
        <Button theme='primary' prefixIcon={IconWrapper} round={true} />
      </Wrapper>
      <Wrapper>
        <Button variant='text'>button</Button>
        <Button variant='text' theme='primary'>
          button
        </Button>
        <Button variant='text' theme='secondary'>
          button
        </Button>
        <Button variant='text' theme='error'>
          button
        </Button>
        <Button round={true} variant='text' theme='warning'>
          button
        </Button>
        <Button variant='text' theme='primary' prefixIcon={IconWrapper}>
          button
        </Button>
        <Button theme='primary' prefixIcon={IconWrapper} round={true} />
      </Wrapper>
      <Wrapper>
        <Button variant='outlined'>button</Button>
        <Button variant='outlined' theme='primary'>
          button
        </Button>
        <Button variant='outlined' theme='secondary'>
          button
        </Button>
        <Button variant='outlined' theme='error'>
          button
        </Button>
        <Button round={true} variant='outlined' theme='warning'>
          button
        </Button>
        <Button variant='outlined' theme='primary' prefixIcon={IconWrapper}>
          button
        </Button>
        <Button theme='primary' prefixIcon={IconWrapper} round={true} />
      </Wrapper>
    </div>
  );
};
