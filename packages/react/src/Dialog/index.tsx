import Dialog from './Dialog';
import { open, destroyAll, success, info, error, warning, confirm } from './methods';
import useDialog from './useDialog';

export * from './Dialog';
export * from './message';
export {
  MethodDialogFunctionUpdate,
  MethodDialogFunctionProps,
  MethodDialogFunctionRenderProps,
  MethodDialogFunctionReturnType,
} from './methods';

const DialogEnhancer = Dialog as typeof Dialog & {
  open: typeof open;
  destroyAll: typeof destroyAll;
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
