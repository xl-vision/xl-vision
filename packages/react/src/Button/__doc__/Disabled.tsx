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

const Disabled = () => {
  return (
    <Wrapper>
      <Button disabled={true}>button</Button>
      <Button disabled={true} color='primary'>
        button
      </Button>
      <Button disabled={true} color='secondary'>
        button
      </Button>
      <Button disabled={true} color='error'>
        button
      </Button>
      <Button disabled={true} round={true} color='warning'>
        button
      </Button>
      <Button disabled={true} color='primary' prefixIcon={IconWrapper}>
        button
      </Button>
    </Wrapper>
  );
};

export default Disabled;
