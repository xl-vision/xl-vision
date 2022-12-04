import useMessage from './useMessage';
import { MessageConfig, info, warning, error, success, open, loading, setConfig } from './methods';

export * from './Message';
export * from './MessageList';
export * from './useMessage';

export type { MessageConfig };

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
