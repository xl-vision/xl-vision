import useMessage from './useMessage';
import {
  MessageGlobalConfig,
  MethodMessageContainerProps,
  info,
  warning,
  error,
  success,
  open,
  loading,
  setGlobalConfig,
} from './methods';

export * from './Message';
export * from './MessageContainer';
export * from './useMessage';

export type { MessageGlobalConfig, MethodMessageContainerProps };

const Message = {
  useMessage,
  info,
  warning,
  error,
  success,
  open,
  loading,
  setGlobalConfig,
};

export default Message;
