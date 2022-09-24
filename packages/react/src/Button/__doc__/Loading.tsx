import { Button, styled } from '@xl-vision/react';
import { LockFilled } from '@xl-vision/icons';
import { useState, useRef, useCallback, useEffect } from 'react';

const IconWrapper = <LockFilled />;

const Wrapper = styled('div')(() => {
  return {
    'button, a': {
      marginRight: 10,
      marginBottom: 10,
    },
  };
});

const Loading = () => {
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();

  const handleLoading = useCallback(() => {
    setLoading(true);
    timerRef.current = setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== undefined) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Wrapper>
      <Button loading={loading} onClick={handleLoading}>
        click me
      </Button>
      <Button variant='text' loading={loading} prefixIcon={IconWrapper} color='primary'>
        button
      </Button>
      <Button loading={loading} color='secondary'>
        button
      </Button>
      <Button variant='text' loading={loading} color='error'>
        button
      </Button>
      <Button variant='outlined' loading={loading} color='warning'>
        button
      </Button>
    </Wrapper>
  );
};

export default Loading;
