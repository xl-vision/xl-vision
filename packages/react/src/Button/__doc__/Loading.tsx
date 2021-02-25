import React from 'react';
import { Button } from '@xl-vision/react';

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
    <div className='container'>
      <Button loading={loading} onClick={handleLoading}>
        click me
      </Button>
      <Button loading={loading} theme='primary'>
        button
      </Button>
      <Button loading={loading} theme='secondary'>
        button
      </Button>
      <Button loading={loading} theme='error'>
        button
      </Button>
      <Button loading={loading} theme='warning'>
        button
      </Button>
    </div>
  );
};
