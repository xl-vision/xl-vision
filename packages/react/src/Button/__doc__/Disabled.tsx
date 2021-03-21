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
    <Wrapper>
      <Button disabled={true}>button</Button>
      <Button disabled={true} theme='primary'>
        button
      </Button>
      <Button disabled={true} theme='secondary'>
        button
      </Button>
      <Button disabled={true} theme='error'>
        button
      </Button>
      <Button disabled={true} round={true} theme='warning'>
        button
      </Button>
      <Button disabled={true} theme='primary' prefixIcon={IconWrapper}>
        button
      </Button>
    </Wrapper>
  );
};
