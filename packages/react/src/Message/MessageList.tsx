import { Children, FC, ReactNode } from 'react';
import Portal, { PortalContainerType } from '../Portal';
import { styled } from '../styles';

export type MessageListProps = {
  top: number;
  container: PortalContainerType<HTMLElement>;
  children: ReactNode;
  zIndex: number;
};

const displayName = 'MessageList';

const MessageListRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
  };
});

const MessageList: FC<MessageListProps> = ({ top, container, children, zIndex }) => {
  if (!Children.count(children)) {
    return null;
  }

  return (
    <Portal container={container}>
      <MessageListRoot style={{ top, zIndex }}>{children}</MessageListRoot>
    </Portal>
  );
};

export default MessageList;
