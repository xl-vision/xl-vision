/* eslint-disable @typescript-eslint/no-floating-promises */
import { Button, Notication, styled } from '@xl-vision/react';
import { useCallback } from 'react';

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
    notication.info('doing some work').then(() => {
      notication.success('done successful');
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
