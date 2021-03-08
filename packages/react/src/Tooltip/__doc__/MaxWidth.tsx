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
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda error quasi, in recusandae
    dolores qui eligendi, sint consequatur est provident ipsum. Deleniti repudiandae dolorem nam, et
    quisquam fugiat officia debitis?
  </span>
);

export default () => {
  return (
    <Wrapper>
      <Tooltip placement='top' content={content} maxWidth={200}>
        <Button>button</Button>
      </Tooltip>
    </Wrapper>
  );
};
