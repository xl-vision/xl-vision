/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Portal, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(({ theme }) => {
  return {
    '.container1, .container2': {
      height: '150px',
      color: '#fff',
      textAlign: 'center',
      padding: '15px',
      borderRadius: '4px',
      '> p': {
        fontSize: '20px',
        fontWeight: 'bold',
      },
    },
    '.container1': {
      backgroundColor: theme.color.themes.primary.color,
    },
    '.container2': {
      marginTop: '16px',
      backgroundColor: theme.color.themes.secondary.color,
    },
  };
});

export default () => {
  const handleClick = React.useCallback(() => {
    alert('You clicked container1!');
  }, []);

  const [node, setNode] = React.useState<React.ReactElement>();

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const portal = (
      <Portal getContainer={() => ref.current}>
        <Button theme='primary' className='content'>
          点击
        </Button>
      </Portal>
    );
    setNode(portal);
  }, []);

  return (
    <Wrapper>
      <div className='container1' onClick={handleClick}>
        <p>container1</p>
        {node}
      </div>
      <div className='container2' ref={ref}>
        <p>container2</p>
      </div>
    </Wrapper>
  );
};
