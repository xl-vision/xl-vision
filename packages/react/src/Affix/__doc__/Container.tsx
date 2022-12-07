import { useCallback, useRef } from 'react';
import { Affix, Button, styled } from '@xl-vision/react';

const Root = styled('div')(() => {
  return {
    height: 200,
    overflowY: 'auto',
    '.block': {
      height: 500,
      backgroundImage: `url('https://zos.alipayobjects.com/rmsportal/RmjwQiJorKyobvI.jpg')`,
    },
  };
});

const Demo = () => {
  const ref = useRef<HTMLDivElement>(null);

  const target = useCallback(() => {
    return ref.current!;
  }, []);

  return (
    <Root ref={ref}>
      <div className='block'>
        <Affix offsetTop={50} target={target}>
          <Button>fixed in container</Button>
        </Affix>
      </div>
    </Root>
  );
};

export default Demo;
