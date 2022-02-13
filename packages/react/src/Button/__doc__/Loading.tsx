import React from 'react';
import { Button, styled } from '@xl-vision/react';
import { LockFilled } from '@xl-vision/icons';

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
  const [loading, setLoading] = React.useState(false);

  const timerRef = React.useRef<NodeJS.Timeout>();

  const handleLoading = React.useCallback(() => {
    setLoading(true);
    timerRef.current = setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  React.useEffect(() => {
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
