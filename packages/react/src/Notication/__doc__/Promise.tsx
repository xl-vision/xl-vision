'use client';

import { useCallback } from 'react';
import { Button, Notication, styled } from '@xl-vision/react';

const Root = styled('div')(() => {
  return {
    '> *': {
      marginRight: 8,
    },
  };
});

const Demo = () => {
  const [notication, holder] = Notication.useNotication();

  const handleInfo = useCallback(() => {
    void notication.info('doing some work').then(() => {
      void notication.success('done successful');
    });
  }, [notication]);

  return (
    <Root>
      {holder}
      <Button color='info' onClick={handleInfo}>
        click
      </Button>
    </Root>
  );
};

export default Demo;
