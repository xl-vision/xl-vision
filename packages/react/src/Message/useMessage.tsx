import { NoticationHookReturnType, NoticationOptions, useNotication } from '@xl-vision/hooks';
import { useCallback, useMemo, useState } from 'react';
import { increaseZindex } from '../utils/zIndexManger';
import Message, { MessageProps, MessageType } from './Message';
import MessageList, { MessageContainerProps } from './MessageContainer';

export type MessageHookOptions = NoticationOptions<Omit<MessageContainerProps, 'zIndex'>>;

export type MessageHookReturnType = NoticationHookReturnType<MessageProps>;

const useMessage = (options: Partial<MessageHookOptions> = {}) => {
  const [zIndex, setZIndex] = useState<number>();

  const [instance, holder] = useNotication(Message, MessageList, {
    ...options,
    zIndex,
  });

  const method = useCallback(
    (props: MessageProps | string, type?: MessageType): MessageHookReturnType => {
      setZIndex(() => increaseZindex());

      const parsedProps: MessageProps =
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
      open: (props: MessageProps) => method(props),
      loading: (props: Omit<MessageProps, 'type'> | string) => method(props, 'loading'),
      error: (props: Omit<MessageProps, 'type'> | string) => method(props, 'error'),
      info: (props: Omit<MessageProps, 'type'> | string) => method(props, 'info'),
      success: (props: Omit<MessageProps, 'type'> | string) => method(props, 'success'),
      warning: (props: Omit<MessageProps, 'type'> | string) => method(props, 'warning'),
      destroyAll: () => {
        instance.destroyAll();
      },
    }),
    [instance, method],
  );

  return [methods, holder] as const;
};

export default useMessage;
