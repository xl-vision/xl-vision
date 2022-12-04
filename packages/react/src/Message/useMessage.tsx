import {
  NoticationHookProps,
  NoticationHookReturnType,
  NoticationOptions,
  useNotication,
} from '@xl-vision/hooks';
import { useCallback, useMemo, useState } from 'react';
import { PortalContainerType } from '../Portal';
import { increaseZindex } from '../utils/zIndexManger';
import Message, { MessageProps, MessageType } from './Message';
import MessageList from './MessageList';

export type MessageHookOptions = NoticationOptions<{
  top: number;
  container: PortalContainerType<HTMLElement>;
}>;

export type MessageHookProps = NoticationHookProps<MessageProps>;

export type MessageHookReturnType = NoticationHookReturnType<MessageHookProps>;

const DEFAULT_CONTAINER = () => document.body;

const useMessage = ({
  top = 8,
  container = DEFAULT_CONTAINER,
  maxCount,
}: Partial<MessageHookOptions> = {}) => {
  const [zIndex] = useState(() => increaseZindex());

  const [instance, holder] = useNotication(MessageList, Message, {
    top,
    container,
    maxCount,
    zIndex,
  });

  const method = useCallback(
    (props: MessageHookProps | string, type?: MessageType): MessageHookReturnType => {
      const parsedProps: MessageHookProps =
        typeof props === 'string' ? { content: props } : { ...props };

      if (type) {
        parsedProps.type = type;
      }
      return instance.open(parsedProps);
    },
    [instance],
  );

  const methods = useMemo(
    () => ({
      open: (props: MessageHookProps) => method(props),
      loading: (props: Omit<MessageHookProps, 'type'> | string) => method(props, 'loading'),
      error: (props: Omit<MessageHookProps, 'type'> | string) => method(props, 'error'),
      info: (props: Omit<MessageHookProps, 'type'> | string) => method(props, 'info'),
      success: (props: Omit<MessageHookProps, 'type'> | string) => method(props, 'success'),
      warning: (props: Omit<MessageHookProps, 'type'> | string) => method(props, 'warning'),
      destroyAll: () => {
        instance.destroyAll();
      },
    }),
    [instance, method],
  );

  return [methods, holder] as const;
};

export default useMessage;
