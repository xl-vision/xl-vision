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
    parent content
    <Tooltip trigger='click' content='child content'>
      <Button theme='primary'>btn</Button>
    </Tooltip>
  </span>
);

export default () => {
  const [visible, setVisible] = React.useState(false);

  const handleCustomClick = React.useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return (
    <Wrapper>
      <Tooltip trigger='hover' placement='top' content={content}>
        <Button theme='primary'>hover</Button>
      </Tooltip>
      <Tooltip trigger='click' placement='top' content={content}>
        <Button theme='primary'>click</Button>
      </Tooltip>
      <Tooltip trigger='focus' placement='top' content={content}>
        <Button theme='primary'>focus</Button>
      </Tooltip>
      <Tooltip trigger='contextMenu' placement='top' content={content}>
        <Button theme='primary'>contextMenu</Button>
      </Tooltip>
      <Tooltip trigger='custom' visible={visible} placement='top' content={content}>
        <Button theme='primary' onClick={handleCustomClick}>
          custom(click twice)
        </Button>
      </Tooltip>
    </Wrapper>
  );
};
