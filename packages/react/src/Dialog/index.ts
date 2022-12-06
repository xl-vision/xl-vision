import Dialog from './Dialog';
import {
  open,
  destroyAll,
  success,
  info,
  error,
  warning,
  confirm,
  MethodDialogProps,
} from './methods';
import useDialog from './useDialog';

export * from './Dialog';
export * from './DedicatedDialog';
// export * from './useDialog';

export type { MethodDialogProps };

const DialogEnhancer = Dialog as typeof Dialog & {
  destroyAll: typeof destroyAll;
  open: typeof open;
  info: typeof info;
  success: typeof success;
  error: typeof error;
  warning: typeof warning;
  confirm: typeof confirm;
  useDialog: typeof useDialog;
};

DialogEnhancer.open = open;
DialogEnhancer.destroyAll = destroyAll;
DialogEnhancer.success = success;
DialogEnhancer.info = info;
DialogEnhancer.error = error;
DialogEnhancer.warning = warning;
DialogEnhancer.confirm = confirm;
DialogEnhancer.useDialog = useDialog;

export default DialogEnhancer;
