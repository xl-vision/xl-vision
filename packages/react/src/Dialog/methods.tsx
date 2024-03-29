import { FC, Fragment } from 'react';
import DedicatedDialog, { DedicatedDialogProps, DialogType } from './DedicatedDialog';
import { ThemeProvider, ThemeProviderProps } from '../ThemeProvider';
import createNotication from '../utils/createNotication';

export type MethodDialogProps = DedicatedDialogProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
};

const MethodDialog: FC<MethodDialogProps> = ({ themeProviderProps, ...others }) => {
  return (
    <ThemeProvider {...themeProviderProps}>
      <DedicatedDialog {...others} />
    </ThemeProvider>
  );
};

const { open: innerOpen, destroyAll } = createNotication(MethodDialog, Fragment, {});

export const method = (props: MethodDialogProps, type?: DialogType) => {
  const currentProps = { ...props };

  if (type) {
    currentProps.type = type;
  }

  return innerOpen(currentProps);
};

export const open = (props: MethodDialogProps) => method(props);
export const confirm = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'confirm');
export const info = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'info');
export const warning = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'warning');
export const error = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'error');
export const success = (props: Omit<MethodDialogProps, 'type'>) => method(props, 'success');
export { destroyAll };
