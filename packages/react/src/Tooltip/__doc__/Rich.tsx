import React from 'react';
import { Tooltip, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    button: {
      marginRight: '16px',
      marginBottom: '16px',
    },
  };
});

const content = (
  <span>
    this is a <span style={{ color: 'red' }}>red</span> color
  </span>
);

export default () => {
  return (
    <Wrapper>
      <Tooltip placement='top' content={content}>
        <Button theme='primary'>button</Button>
      </Tooltip>
    </Wrapper>
  );
};
