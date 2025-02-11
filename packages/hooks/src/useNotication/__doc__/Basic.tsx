'use client';

import { Button, Portal, styled } from '@xl-vision/react';
import { FC, useCallback, useEffect, useRef } from 'react';
import {
  useCssTransition,
  useNotication,
  useValueChange,
  NoticationProps,
  NoticationContainerProps,
} from '@xl-vision/hooks';

type MessageProps = NoticationProps & { content: string };

const MessageRoot = styled('div')(({ theme }) => {
  return {
    maxHeight: 100,
    opacity: 1,
    padding: `8px 0`,
    '.inner': {
      padding: `4px 8px`,
      borderRadius: 4,
      backgroundColor: theme.colors.background.paper,
      boxShadow: theme.elevations[3],
    },
    '&.demo': {
      '&-appear-active, &-exit-active': {
        transition: 'all 0.4s linear',
      },
      '&-appear-from, &-exit-to': {
        opacity: 0,
        maxHeight: 0,
        padding: `0 0`,
      },
    },
  };
});

const Message: FC<MessageProps> = ({ content, open: openProp, onOpenChange, onAfterClosed }) => {
  const [open, setOpen] = useValueChange(false, openProp, onOpenChange);

  const { nodeRef } = useCssTransition({
    in: open,
    transitionClassName: 'demo',
    transitionOnFirst: true,
    onExited: onAfterClosed,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [setOpen]);

  return (
    <MessageRoot ref={nodeRef}>
      <div className='inner'>{content}</div>
    </MessageRoot>
  );
};

type ContainerProps = NoticationContainerProps;

const MessageContainerRoot = styled('div')(() => {
  return {
    position: 'fixed',
    top: 0,
    padding: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2000,
  };
});

const MessageContainer: FC<ContainerProps> = ({ children }) => {
  return (
    <Portal container={() => document.body}>
      <MessageContainerRoot>{children}</MessageContainerRoot>
    </Portal>
  );
};

const Demo = () => {
  const [message, holder] = useNotication(Message, MessageContainer, { maxCount: 5 });
  const countRef = useRef(0);

  const handleClick = useCallback(() => {
    void message.open({ content: `message ${countRef.current++}` });
  }, [message]);

  return (
    <div>
      {holder}
      <Button onClick={handleClick}>click</Button>
    </div>
  );
};

export default Demo;
