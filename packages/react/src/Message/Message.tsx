import { forwardRef } from 'react';

export type MessageProps = {};

const Message = forwardRef<HTMLDivElement, MessageProps>((props, ref) => {
  const {} = props;
  return <div ref={ref}></div>;
});

export default Message;
