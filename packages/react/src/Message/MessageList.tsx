import { FC, ReactNode } from 'react';
import Portal, { PortalContainerType } from '../Portal';
import { styled } from '../styles';
import { increaseZindex } from '../utils/zIndexManger';

export type MessageListProps = {
  top: number;
  container: PortalContainerType<HTMLElement>;
  children: ReactNode;
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

const MessageList: FC<MessageListProps> = ({ top, container, children }) => {
  return (
    <Portal container={container}>
      <MessageListRoot style={{ top, zIndex: increaseZindex() }}>{children}</MessageListRoot>
    </Portal>
  );
};

export default MessageList;
