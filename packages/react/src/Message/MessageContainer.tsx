import { NoticationContainerProps } from '@xl-vision/hooks';
import { isProduction, isServer } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { Children, FC } from 'react';
import memoStyled from '../memoStyled';
import Portal, { PortalContainerType } from '../Portal';

export type MessageContainerProps = NoticationContainerProps & {
  top?: number;
  container?: PortalContainerType<HTMLElement>;
  zIndex?: number;
};

const displayName = 'MessageContainer';

const MessageContainerRoot = memoStyled('div', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
});

const DEFAULT_CONTAINER = () => document.body;

const MessageContainer: FC<MessageContainerProps> = ({
  top = 8,
  container = DEFAULT_CONTAINER,
  children,
  zIndex,
}) => {
  if (!Children.count(children)) {
    return null;
  }

  return (
    <Portal container={container}>
      <MessageContainerRoot style={{ top, zIndex }}>{children}</MessageContainerRoot>
    </Portal>
  );
};

if (!isProduction) {
  MessageContainer.displayName = displayName;
  MessageContainer.propTypes = {
    children: PropTypes.node,
    container: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      isServer ? PropTypes.any : PropTypes.instanceOf(Element),
    ]),
    top: PropTypes.number,
    zIndex: PropTypes.number,
  };
}

export default MessageContainer;
