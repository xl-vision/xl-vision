import React from 'react';
import { Button, Icon, styled } from '@xl-vision/react';
import LockFilled from '@xl-vision/icons/LockFilled';

const IconWrapper = (
  <Icon>
    <LockFilled />
  </Icon>
);

const Wrapper = styled('div')(() => {
  return {
    'button, a': {
      marginRight: 10,
      marginBottom: 10,
    },
  };
});

export default () => {
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
      <Button variant='text' loading={loading} prefixIcon={IconWrapper} theme='primary'>
        button
      </Button>
      <Button loading={loading} theme='secondary'>
        button
      </Button>
      <Button variant='text' loading={loading} theme='error'>
        button
      </Button>
      <Button variant='outlined' loading={loading} theme='warning'>
        button
      </Button>
    </Wrapper>
  );
};
