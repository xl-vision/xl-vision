import { FC } from 'react';
import Message, { MessageProps, MessageType } from './Message';
import MessageList, { MessageContainerProps } from './MessageContainer';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import createNotication from '../utils/createNotication';
import { increaseZindex } from '../utils/zIndexManger';

export type MethodMessageContainerProps = MessageContainerProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
};

const MessageListWrap: FC<MethodMessageContainerProps> = ({
  themeProviderProps,
  configProviderProps,
  ...others
}) => {
  return (
    <ConfigProvider {...configProviderProps}>
      <ThemeProvider {...themeProviderProps}>
        <MessageList {...others} />
      </ThemeProvider>
    </ConfigProvider>
  );
};

const {
  open: innerOpen,
  destroyAll,
  setGlobalConfig: setInnerGlobalConfig,
} = createNotication(Message, MessageListWrap, {});

export type MessageGlobalConfig = Partial<Omit<MethodMessageContainerProps, 'zIndex'>>;

export const setGlobalConfig = (props: MessageGlobalConfig) => setInnerGlobalConfig(props);

export const method = (props: MessageProps | string, type?: MessageType) => {
  setInnerGlobalConfig({
    zIndex: increaseZindex(),
  });

  const parsedProps: MessageProps = typeof props === 'string' ? { content: props } : { ...props };

  if (type) {
    parsedProps.type = type;
  }

  return innerOpen(parsedProps);
};

export const open = (props: MessageProps) => method(props);
export const loading = (props: Omit<MessageProps, 'type'> | string) => method(props, 'loading');
export const info = (props: Omit<MessageProps, 'type'> | string) => method(props, 'info');
export const warning = (props: Omit<MessageProps, 'type'> | string) => method(props, 'warning');
export const error = (props: Omit<MessageProps, 'type'> | string) => method(props, 'error');
export const success = (props: Omit<MessageProps, 'type'> | string) => method(props, 'success');
export { destroyAll };
