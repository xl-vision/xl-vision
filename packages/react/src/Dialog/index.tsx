import Dialog from './Dialog';
import { method, destroyAll, success, info, error, warning, confirm } from './methods';

export * from './Dialog';
export type { DialogMethodProps, DialogMethodReturnType } from './methods';

const DialogEnhancer = Dialog as typeof Dialog & {
  method: typeof method;
  destroyAll: typeof destroyAll;
  info: typeof info;
  success: typeof success;
  error: typeof error;
  warning: typeof warning;
  confirm: typeof confirm;
};

DialogEnhancer.method = method;
DialogEnhancer.destroyAll = destroyAll;
DialogEnhancer.success = success;
DialogEnhancer.info = info;
DialogEnhancer.error = error;
DialogEnhancer.warning = warning;
DialogEnhancer.confirm = confirm;

export default DialogEnhancer;
