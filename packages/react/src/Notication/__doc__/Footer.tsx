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
  const [notication, holder] = Notication.useNotication({ maxCount: 3 });

  const handleInfo = useCallback(() => {
    const { destroy } = notication.info({
      message: 'Message',
      description:
        'this is a description this is a description this is a description this is a description',
      duration: 0,
      footer: (
        <>
          <Button color='primary' size='small' onClick={() => destroy()}>
            confirm
          </Button>
          <Button size='small' style={{ marginLeft: 8 }} onClick={() => destroy()}>
            cancel
          </Button>
        </>
      ),
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
