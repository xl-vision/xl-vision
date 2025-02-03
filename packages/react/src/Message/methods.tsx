import { NoticationHookProps } from '@xl-vision/hooks';
import { FC } from 'react';
import MessageWrapper, { MessageWrapperProps, MessageType } from './Message';
import MessageContainer, { MessageContainerProps } from './MessageContainer';
import { ThemeProvider, ThemeProviderProps } from '../ThemeProvider';
import createNotication from '../utils/createNotication';
import { increaseZindex } from '../utils/zIndexManger';

export type MethodMessageContainerProps = MessageContainerProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
};

const MessageContainerWrap: FC<MethodMessageContainerProps> = ({
  themeProviderProps,
  ...others
}) => {
  return (
    <ThemeProvider {...themeProviderProps}>
      <MessageContainer {...others} />
    </ThemeProvider>
  );
};

const {
  open: innerOpen,
  destroyAll,
  setGlobalConfig: setInnerGlobalConfig,
} = createNotication(MessageWrapper, MessageContainerWrap, {});

export type MessageGlobalConfig = Partial<Omit<MethodMessageContainerProps, 'zIndex'>>;

export const setGlobalConfig = (props: MessageGlobalConfig) => setInnerGlobalConfig(props);

export const method = (props: MessageWrapperProps | string, type?: MessageType) => {
  setInnerGlobalConfig({
    zIndex: increaseZindex(),
  });

  const parsedProps: NoticationHookProps<MessageWrapperProps> =
    typeof props === 'string' ? { content: props } : { ...props };

  if (type) {
    parsedProps.type = type;
  }

  return innerOpen(parsedProps);
};

export const open = (props: MessageWrapperProps) => method(props);
export const loading = (props: Omit<MessageWrapperProps, 'type'> | string) =>
  method(props, 'loading');
export const info = (props: Omit<MessageWrapperProps, 'type'> | string) => method(props, 'info');
export const warning = (props: Omit<MessageWrapperProps, 'type'> | string) =>
  method(props, 'warning');
export const error = (props: Omit<MessageWrapperProps, 'type'> | string) => method(props, 'error');
export const success = (props: Omit<MessageWrapperProps, 'type'> | string) =>
  method(props, 'success');
export { destroyAll };
