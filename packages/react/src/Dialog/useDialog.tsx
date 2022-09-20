import { isProduction, warning as warningLog } from '@xl-vision/utils';
import {
  forwardRef,
  useState,
  useImperativeHandle,
  ReactElement,
  useCallback,
  createRef,
  useMemo,
} from 'react';
import createMessageDialog, { MessageDialogProps, MessageDialogType } from './message';
import { MessageDialogFunctionProps } from './methods';

type HookMessageDialogRef = {
  update: (updateProps: MessageDialogProps) => void;
};

export type MessageDialogHookProps = Omit<
  MessageDialogFunctionProps,
  'themeContext' | 'localizationContext'
>;

export type MethodDialogHookUpdate = (
  props:
    | Partial<MessageDialogHookProps>
    | ((prev: MessageDialogHookProps) => Partial<MessageDialogHookProps>),
) => void;

export type MessageDialogHookReturnType = {
  destroy: () => void;
  update: MethodDialogHookUpdate;
};

const createHookMessageDialog = (props: MessageDialogProps, type?: MessageDialogType) => {
  const Dialog = createMessageDialog(type);

  const HookMessageDialog = forwardRef<HookMessageDialogRef>((_, ref) => {
    const [innerConfig, setInnerConfig] = useState<MessageDialogProps>(props);

    useImperativeHandle(ref, () => {
      return {
        update(updateProps) {
          setInnerConfig(updateProps);
        },
      };
    });

    return <Dialog {...innerConfig} />;
  });

  if (!isProduction) {
    HookMessageDialog.displayName = 'HookMessageDialog';
  }

  return HookMessageDialog;
};

let uuid = 0;

const useDialog = () => {
  const [dialogs, setDialogs] = useState<Array<ReactElement>>([]);

  const method = useCallback(
    (props: MessageDialogHookProps, type?: MessageDialogType): MessageDialogHookReturnType => {
      let currentProps: MessageDialogProps = {
        ...props,
        visible: undefined,
        defaultVisible: true,
        onAfterClosed: () => {
          props.onAfterClosed?.();
          destroyDOM();
        },
      };
      const Dialog = createHookMessageDialog(currentProps, type);

      const ref = createRef<HookMessageDialogRef>();

      let destroyState = false;

      const dialog = <Dialog key={`dialog${uuid++}`} ref={ref} />;

      const destroyDOM = () => {
        setDialogs((prev) => prev.filter((it) => it !== dialog));
      };

      const render = (renderProps: MessageDialogProps) => {
        if (destroyState) {
          return warningLog(
            true,
            `The dialog instance was destroyed, please do not update or destroy it again.`,
          );
        }
        ref.current?.update(renderProps);
      };

      const update: MethodDialogHookUpdate = (updateProps) => {
        const newProps =
          typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
        currentProps = { ...currentProps, ...newProps, visible: undefined, defaultVisible: true };

        const { onAfterClosed } = currentProps;

        currentProps.onAfterClosed = () => {
          onAfterClosed?.();
          destroyDOM();
        };
        render(currentProps);
      };

      const destroy = () => {
        render({
          ...currentProps,
          visible: false,
          onAfterClosed() {
            currentProps.onAfterClosed?.();
            destroyDOM();
          },
        });
        destroyState = true;
      };

      setDialogs((prev) => [...prev, dialog]);

      return {
        update,
        destroy,
      };
    },
    [],
  );

  const methods = useMemo(
    () => ({
      open: (props: MessageDialogFunctionProps) => method(props),
      confirm: (props: MessageDialogFunctionProps) => method(props, 'confirm'),
      error: (props: MessageDialogFunctionProps) => method(props, 'error'),
      info: (props: MessageDialogFunctionProps) => method(props, 'info'),
      success: (props: MessageDialogFunctionProps) => method(props, 'success'),
      warning: (props: MessageDialogFunctionProps) => method(props, 'warning'),
    }),
    [method],
  );

  return [methods, dialogs] as const;
};

export default useDialog;
