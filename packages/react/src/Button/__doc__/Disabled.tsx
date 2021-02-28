import React from 'react';
import { Button, Icon, styled } from '@xl-vision/react';
import SearchOutlined from '@xl-vision/icons/SearchOutlined';

const IconWrapper = (
  <Icon>
    <SearchOutlined />
  </Icon>
);

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
