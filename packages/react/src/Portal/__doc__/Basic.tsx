import { useCallback, useState, ReactElement, useRef, useEffect } from 'react';
import { Portal, Button, styled, Message } from '@xl-vision/react';

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
      backgroundColor: theme.colors.themes.primary.foreground.enabled,
    },
    '.container2': {
      marginTop: '16px',
      backgroundColor: theme.colors.themes.error.foreground.enabled,
    },
  };
});

const Basic = () => {
  const [message, holder] = Message.useMessage();

  const handleClick = useCallback(() => {
    message.success('You clicked container1!');
  }, [message]);

  const [node, setNode] = useState<ReactElement>();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const portal = (
      <Portal container={() => ref.current}>
        <Button className='content' color='primary'>
          点击
        </Button>
      </Portal>
    );
    setNode(portal);
  }, []);

  return (
    <Wrapper>
      {holder}
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
