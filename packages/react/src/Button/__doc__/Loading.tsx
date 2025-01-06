'use client';

import { LockFilled } from '@xl-vision/icons';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button, styled } from '@xl-vision/react';

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

  const timerRef = useRef<number>(null);

  const handleLoading = useCallback(() => {
    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Wrapper>
      <Button loading={loading} onClick={handleLoading}>
        click me
      </Button>
      <Button color='primary' loading={loading} prefixIcon={IconWrapper} variant='text'>
        button
      </Button>
      <Button color='error' loading={loading} variant='text'>
        button
      </Button>
      <Button color='warning' loading={loading} variant='outlined'>
        button
      </Button>
    </Wrapper>
  );
};

export default Loading;
