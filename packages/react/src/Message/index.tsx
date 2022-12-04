import useMessage from './useMessage';
import {
  MessageConfig,
  MessageMethodProps,
  MessageMethodReturnType,
  MessageMethodUpdate,
  info,
  warning,
  error,
  success,
  open,
  loading,
  setConfig,
} from './methods';

export * from './Message';
export * from './MessageList';
export * from './useMessage';

export { MessageConfig, MessageMethodProps, MessageMethodReturnType, MessageMethodUpdate };

const Message = {
  useMessage,
  info,
  warning,
  error,
  success,
  open,
  loading,
  setConfig,
};

export default Message;
