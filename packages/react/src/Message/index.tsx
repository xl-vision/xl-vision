import { warning } from '@xl-vision/utils';
import useDialog from '../Dialog/useDialog';
import { setConfig } from './config';
import { destroyAll, info, success, error, open, loading } from './methods';
import useMessage from './useMessage';

export * from './createMessage';

const Message = {
  open,
  destroyAll,
  info,
  success,
  error,
  warning,
  loading,
  useDialog,
  config: setConfig,
  useMessage,
};

export default Message;
