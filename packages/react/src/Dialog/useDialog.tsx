import { useNotication } from '@xl-vision/hooks';
import { useMemo, Fragment } from 'react';
import DedicatedDialog, { DedicatedDialogProps } from './DedicatedDialog';

const useDialog = () => {
  const [instance, holder] = useNotication(DedicatedDialog, Fragment, {});

  const methods = useMemo(
    () => ({
      open: (props: DedicatedDialogProps) => instance.open(props),
      confirm: (props: Omit<DedicatedDialogProps, 'type'>) =>
        instance.open({ ...props, type: 'confirm' }),
      error: (props: Omit<DedicatedDialogProps, 'type'>) =>
        instance.open({ ...props, type: 'error' }),
      info: (props: Omit<DedicatedDialogProps, 'type'>) =>
        instance.open({ ...props, type: 'info' }),
      success: (props: Omit<DedicatedDialogProps, 'type'>) =>
        instance.open({ ...props, type: 'success' }),
      warning: (props: Omit<DedicatedDialogProps, 'type'>) =>
        instance.open({ ...props, type: 'warning' }),
      destroyAll: instance.destroyAll,
    }),
    [instance],
  );

  return [methods, holder] as const;
};

export default useDialog;
