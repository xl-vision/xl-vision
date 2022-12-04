import { Button, Message, styled } from '@xl-vision/react';
import { useCallback } from 'react';

const Root = styled('div')(() => {
  return {
    '> *': {
      marginRight: 8,
    },
  };
});

const Demo = () => {
  const [message, holder] = Message.useMessage();

  const handleInfo = useCallback(() => {
    const { update } = message.open({
      type: 'loading',
      content: 'hello world',
      duration: 4000,
    });

    setTimeout(() => {
      update({
        type: 'info',
        content: 'content is updated!',
      });
    }, 2000);
  }, [message]);

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
