import { FC, Fragment } from 'react';
import DedicatedDialog, { DedicatedDialogProps, DialogType } from './DedicatedDialog';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import createNotication from '../utils/createNotication';

export type MethodDialogProps = DedicatedDialogProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
};

const MethodDialog: FC<MethodDialogProps> = ({
  themeProviderProps,
  configProviderProps,
  ...others
}) => {
  return (
    <ConfigProvider {...configProviderProps}>
      <ThemeProvider {...themeProviderProps}>
        <DedicatedDialog {...others} />
      </ThemeProvider>
    </ConfigProvider>
  );
};

const { open: innerOpen, destroyAll } = createNotication(MethodDialog, Fragment, {});

export const method = (props: MethodDialogProps, type?: DialogType) => {
  const currentProps = { ...props };

  if (type) {
    currentProps.type = type;
  }

  const ret = innerOpen(currentProps);

  return {
    update: ret.update,
    destroy: ret.destroy,
    isDestroyed: ret.isDestroyed,
  };
};

export const open = (props: MethodDialogProps) => method(props);
export const confirm = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'confirm');
export const info = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'info');
export const warning = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'warning');
export const error = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'error');
export const success = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'success');
export { destroyAll };
