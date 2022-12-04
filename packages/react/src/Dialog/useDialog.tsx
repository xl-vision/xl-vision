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
import MethodDialog, { MethodDialogProps } from './MethodDialog';

type HookDialogRef = {
  update: (updateProps: MethodDialogProps) => void;
};

export type DialogHookProps = Omit<MethodDialogProps, 'visible' | 'defaultVisible'>;

export type DialogHookUpdate = (
  props: Partial<DialogHookProps> | ((prev: DialogHookProps) => Partial<DialogHookProps>),
) => void;

export type DialogHookReturnType = {
  destroy: () => void;
  update: DialogHookUpdate;
  isDestoryed: () => boolean;
};

const createHookDialog = (props: MethodDialogProps) => {
  const HookDialog = forwardRef<HookDialogRef>((_, ref) => {
    const [methodDialogProps, setMethodDialogProps] = useState<MethodDialogProps>(props);

    useImperativeHandle(ref, () => {
      return {
        update(updateProps) {
          setMethodDialogProps(updateProps);
        },
      };
    });

    return <MethodDialog {...methodDialogProps} />;
  });

  if (!isProduction) {
    HookDialog.displayName = 'HookDialog';
  }

  return HookDialog;
};

let uuid = 0;

const useDialog = () => {
  const [dialogs, setDialogs] = useState<Array<ReactElement>>([]);

  const method = useCallback((props: DialogHookProps): DialogHookReturnType => {
    let currentProps: MethodDialogProps = {
      ...props,
      visible: undefined,
      defaultVisible: true,
    };
    const Dialog = createHookDialog({
      ...currentProps,
      onAfterClosed() {
        destroyDOM();
        currentProps.onAfterClosed?.();
      },
    });

    const ref = createRef<HookDialogRef>();

    let destroyState = false;

    const dialog = <Dialog key={`dialog${uuid++}`} ref={ref} />;

    const destroyDOM = () => {
      setDialogs((prev) => prev.filter((it) => it !== dialog));
      destroyState = true;
    };

    const render = (renderProps: MethodDialogProps) => {
      if (destroyState) {
        return warningLog(
          true,
          `The dialog instance was destroyed, please do not update or destroy it again.`,
        );
      }

      ref.current?.update({
        ...renderProps,
        onAfterClosed() {
          destroyDOM();
          renderProps.onAfterClosed?.();
        },
      });
    };

    const update: DialogHookUpdate = (updateProps) => {
      const newProps = typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;

      currentProps = {
        ...currentProps,
        ...newProps,
        visible: undefined,
        defaultVisible: true,
      };

      render(currentProps);
    };

    const destroy = () => {
      render({
        ...currentProps,
        visible: false,
      });
    };

    setDialogs((prev) => [...prev, dialog]);

    return {
      update,
      destroy,
      isDestoryed: () => destroyState,
    };
  }, []);

  const methods = useMemo(
    () => ({
      open: (props: DialogHookProps) => method(props),
      confirm: (props: Omit<DialogHookProps, 'type'>) => method({ ...props, type: 'confirm' }),
      error: (props: Omit<DialogHookProps, 'type'>) => method({ ...props, type: 'error' }),
      info: (props: Omit<DialogHookProps, 'type'>) => method({ ...props, type: 'info' }),
      success: (props: Omit<DialogHookProps, 'type'>) => method({ ...props, type: 'success' }),
      warning: (props: Omit<DialogHookProps, 'type'>) => method({ ...props, type: 'warning' }),
    }),
    [method],
  );

  return [methods, dialogs] as const;
};

export default useDialog;
