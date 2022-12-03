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
import createDialog, { DialogType, MethodDialogProps } from './createDialog';

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

const createHookDialog = (props: MethodDialogProps, type?: DialogType) => {
  const Dialog = createDialog(type);

  const HookDialog = forwardRef<HookDialogRef>((_, ref) => {
    const [innerConfig, setInnerConfig] = useState<MethodDialogProps>(props);

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
    HookDialog.displayName = 'HookDialog';
  }

  return HookDialog;
};

let uuid = 0;

const useDialog = () => {
  const [dialogs, setDialogs] = useState<Array<ReactElement>>([]);

  const method = useCallback((props: DialogHookProps, type?: DialogType): DialogHookReturnType => {
    let currentProps: MethodDialogProps = {
      ...props,
      visible: undefined,
      defaultVisible: true,
      onAfterClosed: () => {
        props.onAfterClosed?.();
        destroyDOM();
      },
    };
    const Dialog = createHookDialog(currentProps, type);

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
      ref.current?.update(renderProps);
    };

    const update: DialogHookUpdate = (updateProps) => {
      const newProps = typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
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
      confirm: (props: DialogHookProps) => method(props, 'confirm'),
      error: (props: DialogHookProps) => method(props, 'error'),
      info: (props: DialogHookProps) => method(props, 'info'),
      success: (props: DialogHookProps) => method(props, 'success'),
      warning: (props: DialogHookProps) => method(props, 'warning'),
    }),
    [method],
  );

  return [methods, dialogs] as const;
};

export default useDialog;
