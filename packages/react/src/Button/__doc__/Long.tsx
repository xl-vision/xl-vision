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
      <Button long={true}>button</Button>
      <Button long={true} variant='text' color='primary'>
        button
      </Button>
      <Button long={true} variant='outlined' color='secondary'>
        button
      </Button>
      <Button long={true} round={true} color='warning'>
        button
      </Button>
      <Button long={true} color='primary' prefixIcon={IconWrapper}>
        button
      </Button>
    </Wrapper>
  );
};
