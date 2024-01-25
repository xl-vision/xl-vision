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
    const { update } = notication.open({
      type: 'info',
      message: 'hello world',
    });

    setTimeout(() => {
      update({
        type: 'success',
        message: 'content is updated!',
      });
    }, 2000);
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
