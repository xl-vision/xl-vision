import { NoticationHookProps } from '@xl-vision/hooks';
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

export const method = (props: NoticationHookProps<DedicatedDialogProps>, type?: DialogType) => {
  const currentProps = { ...props };

  if (type) {
    currentProps.type = type;
  }

  return innerOpen(currentProps);
};

export const open = (props: NoticationHookProps<DedicatedDialogProps>) => method(props);
export const confirm = (props: Omit<NoticationHookProps<DedicatedDialogProps>, 'type'>) =>
  method(props, 'confirm');
export const info = (props: Omit<NoticationHookProps<DedicatedDialogProps>, 'type'>) =>
  method(props, 'info');
export const warning = (props: Omit<NoticationHookProps<DedicatedDialogProps>, 'type'>) =>
  method(props, 'warning');
export const error = (props: Omit<NoticationHookProps<DedicatedDialogProps>, 'type'>) =>
  method(props, 'error');
export const success = (props: Omit<NoticationHookProps<DedicatedDialogProps>, 'type'>) =>
  method(props, 'success');
export { destroyAll };
