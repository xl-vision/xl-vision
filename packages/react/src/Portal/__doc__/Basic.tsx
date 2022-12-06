/* eslint-disable no-alert */
import { Portal, Button, styled } from '@xl-vision/react';
import { useCallback, useState, ReactElement, useRef, useEffect } from 'react';

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

const Basic = () => {
  const handleClick = useCallback(() => {
    alert('You clicked container1!');
  }, []);

  const [node, setNode] = useState<ReactElement>();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const portal = (
      <Portal container={() => ref.current}>
        <Button color='primary' className='content'>
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

export default Basic;
