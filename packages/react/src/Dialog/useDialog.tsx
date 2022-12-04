import { NoticationHookProps, NoticationHookReturnType, useNotication } from '@xl-vision/hooks';
import { useMemo, Fragment } from 'react';
import DedicatedDialog, { DedicatedDialogProps } from './DedicatedDialog';

export type DialogHookProps = NoticationHookProps<DedicatedDialogProps>;

export type DialogHookReturnType = NoticationHookReturnType<DedicatedDialogProps>;

const useDialog = () => {
  const [instance, holder] = useNotication(Fragment, DedicatedDialog, {});

  const methods = useMemo(
    () => ({
      open: (props: DialogHookProps) => instance.open(props),
      confirm: (props: Omit<DialogHookProps, 'type'>) =>
        instance.open({ ...props, type: 'confirm' }),
      error: (props: Omit<DialogHookProps, 'type'>) => instance.open({ ...props, type: 'error' }),
      info: (props: Omit<DialogHookProps, 'type'>) => instance.open({ ...props, type: 'info' }),
      success: (props: Omit<DialogHookProps, 'type'>) =>
        instance.open({ ...props, type: 'success' }),
      warning: (props: Omit<DialogHookProps, 'type'>) =>
        instance.open({ ...props, type: 'warning' }),
      destroyAll: instance.destroyAll,
    }),
    [instance],
  );

  return [methods, holder] as const;
};

export default useDialog;
