import message, {
  MessageDialogFunctionProps,
  MessageDialogFunctionReturnType,
  MessageDialogFunctionUpdate,
} from './message';
import { MessageDialogType } from './message/createMessageDialog';

export type MethodDialogFunctionProps = Omit<
  MessageDialogFunctionProps,
  'defaultVisible' | 'visible'
>;
let destoryFunctions: Array<() => void> = [];

const _method = (
  props: MethodDialogFunctionProps,
  type?: MessageDialogType,
): MessageDialogFunctionReturnType => {
  const createHandleClosed = (onClosed?: (isDestory?: true) => void) => (isDestroy?: true) => {
    onClosed?.(isDestroy);
    destoryFunctions = destoryFunctions.filter((it) => it !== destroy);
    if (isDestroy) {
      return;
    }
    destroy();
  };

  const { update, destroy } = message(
    {
      ...props,
      defaultVisible: true,
      visible: undefined,
      onClosed: createHandleClosed(props.onClosed),
    },
    type,
  );

  const updateWrapper: MessageDialogFunctionUpdate = (updateProps) => {
    return update((prev) => {
      const newProps = typeof updateProps === 'function' ? updateProps(prev) : updateProps;
      return {
        ...newProps,
        defaultVisible: true,
        visible: undefined,
        onClosed: createHandleClosed(newProps.onClosed),
      };
    });
  };

  destoryFunctions.push(destroy);

  return {
    destroy,
    update: updateWrapper,
  };
};

export const destroyAll = () => {
  let fn = destoryFunctions.pop();

  while (fn) {
    fn();
    fn = destoryFunctions.pop();
  }
};

export const open = (props: MethodDialogFunctionProps) => _method(props);

export const info = (props: MethodDialogFunctionProps) => _method(props, 'info');
export const success = (props: MethodDialogFunctionProps) => _method(props, 'success');
export const error = (props: MethodDialogFunctionProps) => _method(props, 'error');
export const warning = (props: MethodDialogFunctionProps) => _method(props, 'warning');
export const confirm = (props: MethodDialogFunctionProps) => _method(props, 'confirm');
