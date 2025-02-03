import { NoticationHookProps } from '@xl-vision/hooks';
import { FC } from 'react';
import NoticationWrapper, { NoticationWrapperProps, NoticationType } from './Notication';
import NoticationList, { NoticationContainerProps } from './NoticationContainer';
import { ThemeProvider, ThemeProviderProps } from '../ThemeProvider';
import createNotication from '../utils/createNotication';
import { increaseZindex } from '../utils/zIndexManger';

export type MethodNoticationContainerProps = NoticationContainerProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
};

const NoticationListWrap: FC<MethodNoticationContainerProps> = ({
  themeProviderProps,
  ...others
}) => {
  return (
    <ThemeProvider {...themeProviderProps}>
      <NoticationList {...others} />
    </ThemeProvider>
  );
};

const {
  open: innerOpen,
  destroyAll,
  setGlobalConfig: setInnerGlobalConfig,
} = createNotication(NoticationWrapper, NoticationListWrap, {});

export type NoticationGlobalConfig = Partial<Omit<MethodNoticationContainerProps, 'zIndex'>>;

export const setGlobalConfig = (props: NoticationGlobalConfig) => setInnerGlobalConfig(props);

export const method = (
  props: NoticationHookProps<NoticationWrapperProps> | string,
  type?: NoticationType,
) => {
  setInnerGlobalConfig({
    zIndex: increaseZindex(),
  });

  const parsedProps: NoticationHookProps<NoticationWrapperProps> =
    typeof props === 'string' ? { message: props } : { ...props };

  if (type) {
    parsedProps.type = type;
  }

  return innerOpen(parsedProps);
};

export const open = (props: NoticationHookProps<NoticationWrapperProps>) => method(props);
export const info = (props: Omit<NoticationHookProps<NoticationWrapperProps>, 'type'> | string) =>
  method(props, 'info');
export const warning = (
  props: Omit<NoticationHookProps<NoticationWrapperProps>, 'type'> | string,
) => method(props, 'warning');
export const error = (props: Omit<NoticationHookProps<NoticationWrapperProps>, 'type'> | string) =>
  method(props, 'error');
export const success = (
  props: Omit<NoticationHookProps<NoticationWrapperProps>, 'type'> | string,
) => method(props, 'success');
export { destroyAll };
