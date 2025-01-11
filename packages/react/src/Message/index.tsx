import {
  info,
  warning,
  error,
  success,
  open,
  loading,
  destroyAll,
  setGlobalConfig,
} from './methods';
import useMessage from './useMessage';

export { type MessageGlobalConfig, type MethodMessageContainerProps } from './methods';
export * from './Message';
export * from './MessageContainer';
export * from './useMessage';

const Message = {
  destroyAll,
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
