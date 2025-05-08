import {
  NoticationHookReturnType,
  NoticationOptions,
  NoticationHookProps,
  useNotication,
} from '@xl-vision/hooks';
import { useCallback, useMemo, useState } from 'react';
import MessageWrapper, { MessageWrapperProps, MessageType } from './Message';
import MessageList, { MessageContainerProps } from './MessageContainer';
import { increaseZindex } from '../utils/zIndexManger';

export type MessageHookOptions = NoticationOptions<Omit<MessageContainerProps, 'zIndex'>>;

export type MessageHookReturnType = NoticationHookReturnType<MessageWrapperProps>;

const useMessage = (options: Partial<MessageHookOptions> = {}) => {
  const [zIndex, setZIndex] = useState<number>();

  const [instance, holder] = useNotication(MessageWrapper, MessageList, {
    ...options,
    zIndex,
  });

  const method = useCallback(
    (
      props: NoticationHookProps<MessageWrapperProps> | string,
      type?: MessageType,
    ): MessageHookReturnType => {
      setZIndex(() => increaseZindex());

      const parsedProps: NoticationHookProps<MessageWrapperProps> =
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
      open: (props: NoticationHookProps<MessageWrapperProps>) => method(props),
      loading: (props: Omit<NoticationHookProps<MessageWrapperProps>, 'type'> | string) =>
        method(props, 'loading'),
      error: (props: Omit<NoticationHookProps<MessageWrapperProps>, 'type'> | string) =>
        method(props, 'error'),
      info: (props: Omit<NoticationHookProps<MessageWrapperProps>, 'type'> | string) =>
        method(props, 'info'),
      success: (props: Omit<NoticationHookProps<MessageWrapperProps>, 'type'> | string) =>
        method(props, 'success'),
      warning: (props: Omit<NoticationHookProps<MessageWrapperProps>, 'type'> | string) =>
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
