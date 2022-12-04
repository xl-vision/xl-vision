import { isProduction, warning as warningLog } from '@xl-vision/utils';
import {
  forwardRef,
  useState,
  useImperativeHandle,
  ReactElement,
  useCallback,
  createRef,
  useMemo,
  useRef,
} from 'react';
import DedicatedDialog, { DedicatedDialogProps } from './DedicatedDialog';

type HookDialogRef = {
  update: (updateProps: DedicatedDialogProps) => void;
};

export type DialogHookProps = Omit<DedicatedDialogProps, 'visible' | 'defaultVisible'>;

export type DialogHookUpdate = (
  props: Partial<DialogHookProps> | ((prev: DialogHookProps) => Partial<DialogHookProps>),
) => void;

export type DialogHookReturnType = {
  destroy: () => void;
  update: DialogHookUpdate;
  isDestoryed: () => boolean;
};

const createHookDialog = (props: DedicatedDialogProps) => {
  const HookDialog = forwardRef<HookDialogRef>((_, ref) => {
    const [dialogProps, setDialogProps] = useState<DedicatedDialogProps>(props);

    useImperativeHandle(ref, () => {
      return {
        update(updateProps) {
          setDialogProps(updateProps);
        },
      };
    });

    return <DedicatedDialog {...dialogProps} />;
  });

  if (!isProduction) {
    HookDialog.displayName = 'HookDialog';
  }

  return HookDialog;
};

let uuid = 0;

const useDialog = () => {
  const [dialogs, setDialogs] = useState<Array<ReactElement>>([]);
  const destorysRef = useRef<Array<() => void>>([]);

  const method = useCallback((props: DialogHookProps): DialogHookReturnType => {
    let currentProps: DedicatedDialogProps = {
      ...props,
      visible: undefined,
      defaultVisible: true,
    };

    const onAfterClosedWrap = (onAfterClosed?: () => void) => () => {
      destroyDOM();
      destorysRef.current = destorysRef.current.filter((it) => it !== destroy);
      onAfterClosed?.();
    };

    const Dialog = createHookDialog({
      ...currentProps,
      onAfterClosed: onAfterClosedWrap(currentProps.onAfterClosed),
    });

    const ref = createRef<HookDialogRef>();

    let destroyState = false;

    const dialog = <Dialog key={`dialog${uuid++}`} ref={ref} />;

    const destroyDOM = () => {
      setDialogs((prev) => prev.filter((it) => it !== dialog));
      destroyState = true;
    };

    const render = (renderProps: DedicatedDialogProps) => {
      if (destroyState) {
        return warningLog(
          true,
          `The dialog instance was destroyed, please do not update or destroy it again.`,
        );
      }

      ref.current?.update({
        ...renderProps,
        onAfterClosed: onAfterClosedWrap(renderProps.onAfterClosed),
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

    destorysRef.current.push(destroy);

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
      destroyAll: () => {
        const destroyFns = destorysRef.current;
        let fn = destroyFns.pop();
        while (fn) {
          fn();
          fn = destroyFns.pop();
        }
      },
    }),
    [method],
  );

  return [methods, dialogs] as const;
};

export default useDialog;
