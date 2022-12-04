import ReactDOM from 'react-dom';
import { ReactElement } from 'react';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import MessageList from './MessageList';
import { MessageHookProps } from './useMessage';

export type MessageMethodProps = MessageHookProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
};

export type MessageMethodUpdate = (
  props: Partial<MessageMethodProps> | ((prev: MessageMethodProps) => Partial<MessageMethodProps>),
) => void;

export type MessageMethodReturnType = {
  destroy: () => void;
  update: MessageMethodUpdate;
  isDestoryed: () => boolean;
};
