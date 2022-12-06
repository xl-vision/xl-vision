import { useNotication } from '@xl-vision/hooks';
import { useMemo, Fragment } from 'react';
import DedicatedDialog, { DedicatedDialogProps } from './DedicatedDialog';

const useDialog = () => {
  const [instance, holder] = useNotication(DedicatedDialog, Fragment, {});

  const methods = useMemo(() => {
    const open = (props: DedicatedDialogProps) => {
      const ret = instance.open(props);
      return {
        update: ret.update,
        destroy: ret.destroy,
        isDestroyed: ret.isDestroyed,
      };
    };

    return {
      destroyAll: instance.destroyAll,
      open,
      confirm: (props: Omit<DedicatedDialogProps, 'type'>) => open({ ...props, type: 'confirm' }),
      error: (props: Omit<DedicatedDialogProps, 'type'>) => open({ ...props, type: 'error' }),
      info: (props: Omit<DedicatedDialogProps, 'type'>) => open({ ...props, type: 'info' }),
      success: (props: Omit<DedicatedDialogProps, 'type'>) => open({ ...props, type: 'success' }),
      warning: (props: Omit<DedicatedDialogProps, 'type'>) => open({ ...props, type: 'warning' }),
    };
  }, [instance]);

  return [methods, holder] as const;
};

export default useDialog;
