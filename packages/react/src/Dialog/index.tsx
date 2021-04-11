import Dialog from './Dialog';
import { method } from './methods';

export * from './Dialog';
export type { DialogMethodProps, DialogMethodReturnType } from './methods';

const DialogEnhancer = Dialog as typeof Dialog & {
  method: typeof method;
};

DialogEnhancer.method = method;

export default DialogEnhancer;
