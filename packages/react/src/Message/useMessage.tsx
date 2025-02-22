import {
  NoticationHookReturnType,
  NoticationOptions,
  NoticationHookProps,
  useNotication,
} from '@xl-vision/hooks';
import { useCallback, useMemo, useState } from 'react';
import Message, { MessageProps, MessageType } from './Message';
import MessageList, { MessageContainerProps } from './MessageContainer';
import { increaseZindex } from '../utils/zIndexManger';

export type MessageHookOptions = NoticationOptions<Omit<MessageContainerProps, 'zIndex'>>;

export type MessageHookReturnType = NoticationHookReturnType<MessageProps>;

const useMessage = (options: Partial<MessageHookOptions> = {}) => {
  const [zIndex, setZIndex] = useState<number>();

  const [instance, holder] = useNotication(Message, MessageList, {
    ...options,
    zIndex,
  });

  const method = useCallback(
    (
      props: NoticationHookProps<MessageProps> | string,
      type?: MessageType,
    ): MessageHookReturnType => {
      setZIndex(() => increaseZindex());

      const parsedProps: NoticationHookProps<MessageProps> =
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
      open: (props: NoticationHookProps<MessageProps>) => method(props),
      loading: (props: Omit<NoticationHookProps<MessageProps>, 'type'> | string) =>
        method(props, 'loading'),
      error: (props: Omit<NoticationHookProps<MessageProps>, 'type'> | string) =>
        method(props, 'error'),
      info: (props: Omit<NoticationHookProps<MessageProps>, 'type'> | string) =>
        method(props, 'info'),
      success: (props: Omit<NoticationHookProps<MessageProps>, 'type'> | string) =>
        method(props, 'success'),
      warning: (props: Omit<NoticationHookProps<MessageProps>, 'type'> | string) =>
        method(props, 'warning'),
      destroyAll: () => {
        instance.destroyAll();
      },
    }),
    [instance, method],
  );

  return [methods, holder] as const;
};

export default useMessage;
