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
    'button, a': {
      ':not(:last-child)': {
        marginBottom: 10,
      },
    },
  };
});

export default () => {
  return (
    <Wrapper>
      <Button long={true}>button</Button>
      <Button long={true} variant='text' theme='primary'>
        button
      </Button>
      <Button long={true} variant='outlined' theme='secondary'>
        button
      </Button>
      <Button long={true} round={true} theme='warning'>
        button
      </Button>
      <Button long={true} theme='primary' prefixIcon={IconWrapper}>
        button
      </Button>
    </Wrapper>
  );
};
