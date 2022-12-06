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

const Rich = () => {
  return (
    <Wrapper>
      <Tooltip content={content} placement='top'>
        <Button color='primary'>button</Button>
      </Tooltip>
    </Wrapper>
  );
};

export default Rich;
