import { NoticationContainerProps } from '@xl-vision/hooks';
import { Children, FC } from 'react';
import Portal, { PortalContainerType } from '../Portal';
import { styled } from '../styles';

export type MessageContainerProps = NoticationContainerProps<{
  top: number;
  container: PortalContainerType<HTMLElement>;
  zIndex: number;
}>;

const displayName = 'MessageContainer';

const MessageContainerRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
  };
});

const MessageContainer: FC<MessageContainerProps> = ({ top, container, children, zIndex }) => {
  if (!Children.count(children)) {
    return null;
  }

  return (
    <Portal container={container}>
      <MessageContainerRoot style={{ top, zIndex }}>{children}</MessageContainerRoot>
    </Portal>
  );
};

export default MessageContainer;
