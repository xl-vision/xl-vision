import React from 'react';
import useEventCallback from '../hooks/useEventCallback';
import { isDevelopment } from '../utils/env';
import createMessageDialog, { MessageDialogProps, MessageDialogType } from './message';
import { MethodDialogFunctionProps, MethodDialogFunctionUpdate } from './methods';
import warningLog from '../utils/warning';

type HookMessageDialogRef = {
  update: (updateProps: MessageDialogProps) => void;
};

const createHookMessageDialog = (props: MessageDialogProps, type?: MessageDialogType) => {
  const Dialog = createMessageDialog(type);

  const HookMessageDialog = React.forwardRef<HookMessageDialogRef>((_, ref) => {
    const [innerConfig, setInnerConfig] = React.useState<MessageDialogProps>(props);

    React.useImperativeHandle(ref, () => {
      return {
        update(updateProps) {
          setInnerConfig(updateProps);
        },
      };
    });

    return <Dialog {...innerConfig} />;
  });

  if (isDevelopment) {
    HookMessageDialog.displayName = 'HookMessageDialog';
  }

  return HookMessageDialog;
};

export default () => {
  const [dialogs, setDialogs] = React.useState<Array<React.ReactElement>>([]);

  const method = useEventCallback((props: MethodDialogFunctionProps, type?: MessageDialogType) => {
    let currentProps: MessageDialogProps = {
      ...props,
      visible: undefined,
      defaultVisible: true,
      onAfterClosed: () => {
        props.onAfterClosed?.();
        destroyDOM();
      },
    };
    const Dialog = createHookMessageDialog(
      { ...props, visible: undefined, defaultVisible: true, onAfterClosed: () => {} },
      type,
    );

    const ref = React.createRef<HookMessageDialogRef>();

    let destroyState = false;

    const dialog = <Dialog ref={ref} />;

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

    const update: MethodDialogFunctionUpdate = (updateProps) => {
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
      destroyState = true;
    };

    setDialogs((prev) => [...prev, dialog]);

    return {
      update,
      destroy,
    };
  });

  const methods = React.useMemo(
    () => ({
      open: (props: MethodDialogFunctionProps) => method(props),
      confirm: (props: MethodDialogFunctionProps) => method(props, 'confirm'),
      error: (props: MethodDialogFunctionProps) => method(props, 'error'),
      info: (props: MethodDialogFunctionProps) => method(props, 'info'),
      success: (props: MethodDialogFunctionProps) => method(props, 'success'),
      warning: (props: MethodDialogFunctionProps) => method(props, 'warning'),
    }),
    [method],
  );

  return [methods, dialogs];
};
