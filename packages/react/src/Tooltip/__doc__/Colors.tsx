import { Tooltip, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    button: {
      marginRight: '16px',
      marginBottom: '16px',
    },
  };
});

const content = <span>This is content</span>;

const colors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];

const Colors = () => {
  return (
    <Wrapper>
      {colors.map((it) => (
        <Tooltip bgColor={it} content={content} key={it} placement='top'>
          <Button color='primary'>{it}</Button>
        </Tooltip>
      ))}
    </Wrapper>
  );
};

export default Colors;
