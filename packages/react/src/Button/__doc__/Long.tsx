'use client';

import { SearchOutlined } from '@xl-vision/icons';
import { Button, styled } from '@xl-vision/react';

const IconWrapper = <SearchOutlined />;

const Wrapper = styled('div')(() => {
  return {
    'button, a': {
      marginRight: 10,
      marginBottom: 10,
    },
  };
});

const Long = () => {
  return (
    <Wrapper>
      <Button long={true}>button</Button>
      <Button color='primary' long={true} variant='text'>
        button
      </Button>
      <Button color='warning' long={true} round={true}>
        button
      </Button>
      <Button color='primary' long={true} prefixIcon={IconWrapper}>
        button
      </Button>
    </Wrapper>
  );
};

export default Long;
