import { FC } from 'react';
import Notication, { NoticationProps, NoticationType } from './Notication';
import NoticationList, { NoticationContainerProps } from './NoticationContainer';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import createNotication from '../utils/createNotication';
import { increaseZindex } from '../utils/zIndexManger';

export type MethodNoticationContainerProps = NoticationContainerProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
};

const NoticationListWrap: FC<MethodNoticationContainerProps> = ({
  themeProviderProps,
  configProviderProps,
  ...others
}) => {
  return (
    <ConfigProvider {...configProviderProps}>
      <ThemeProvider {...themeProviderProps}>
        <NoticationList {...others} />
      </ThemeProvider>
    </ConfigProvider>
  );
};

const {
  open: innerOpen,
  destroyAll,
  setGlobalConfig: setInnerGlobalConfig,
} = createNotication(Notication, NoticationListWrap, {});

export type NoticationGlobalConfig = Partial<Omit<MethodNoticationContainerProps, 'zIndex'>>;

export const setGlobalConfig = (props: NoticationGlobalConfig) => setInnerGlobalConfig(props);

export const method = (props: NoticationProps | string, type?: NoticationType) => {
  setInnerGlobalConfig({
    zIndex: increaseZindex(),
  });

  const parsedProps: NoticationProps =
    typeof props === 'string' ? { message: props } : { ...props };

  if (type) {
    parsedProps.type = type;
  }

  return innerOpen(parsedProps);
};

export const open = (props: NoticationProps) => method(props);
export const info = (props: Omit<NoticationProps, 'type'> | string) => method(props, 'info');
export const warning = (props: Omit<NoticationProps, 'type'> | string) => method(props, 'warning');
export const error = (props: Omit<NoticationProps, 'type'> | string) => method(props, 'error');
export const success = (props: Omit<NoticationProps, 'type'> | string) => method(props, 'success');
export { destroyAll };
