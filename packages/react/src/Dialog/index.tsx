import Dialog from './Dialog';
import { method, destroyAll, success, info, error, warning, confirm } from './methods';
import useDialog from './useDialog';

export * from './Dialog';
export type { MethodDialogFunctionProps, DialogMethodReturnType } from './methods';
export type { MethodDialogProps } from './MethodDialog';
export type { MethodDialogHookProps } from './useDialog';

const DialogEnhancer = Dialog as typeof Dialog & {
  method: typeof method;
  destroyAll: typeof destroyAll;
  info: typeof info;
  success: typeof success;
  error: typeof error;
  warning: typeof warning;
  confirm: typeof confirm;
  useDialog: typeof useDialog;
};

DialogEnhancer.method = method;
DialogEnhancer.destroyAll = destroyAll;
DialogEnhancer.success = success;
DialogEnhancer.info = info;
DialogEnhancer.error = error;
DialogEnhancer.warning = warning;
DialogEnhancer.confirm = confirm;
DialogEnhancer.useDialog = useDialog;

export default DialogEnhancer;
