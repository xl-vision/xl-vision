import { useCallback } from 'react';
import { Affix, Button } from '@xl-vision/react';

const Demo = () => {
  const handleChange = useCallback((affixed: boolean) => {
    console.log(affixed);
  }, []);

  return (
    <Affix offsetTop={150} onChange={handleChange}>
      <Button>offset top 150</Button>
    </Affix>
  );
};

export default Demo;
