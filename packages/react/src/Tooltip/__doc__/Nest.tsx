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
      <Button>btn</Button>
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
        <Button>hover</Button>
      </Tooltip>
      <Tooltip trigger='click' placement='top' content={content}>
        <Button>click</Button>
      </Tooltip>
      <Tooltip trigger='focus' placement='top' content={content}>
        <Button>focus</Button>
      </Tooltip>
      <Tooltip trigger='contextMenu' placement='top' content={content}>
        <Button>contextMenu</Button>
      </Tooltip>
      <Tooltip trigger='custom' visible={visible} placement='top' content={content}>
        <Button onClick={handleCustomClick}>custom(click twice)</Button>
      </Tooltip>
    </Wrapper>
  );
};
