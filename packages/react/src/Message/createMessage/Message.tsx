import { isProduction } from '@xl-vision/utils';
import { forwardRef, ReactNode } from 'react';

export type MessageProps = {
  content: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
};

const displayName = 'Message';

const Message = forwardRef<HTMLDivElement, MessageProps>((props, ref) => {
  const {} = props;
  return <div ref={ref}>123</div>;
});

if (!isProduction) {
  Message.displayName = displayName;
  Message.propTypes = {};
}

export default Message;
