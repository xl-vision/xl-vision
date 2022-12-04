import { isProduction, warning as warningLog } from '@xl-vision/utils';
import {
  forwardRef,
  useState,
  useImperativeHandle,
  ReactElement,
  createRef,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { PortalContainerType } from '../Portal';
import { increaseZindex } from '../utils/zIndexManger';
import Message, { MessageProps, MessageType } from './Message';
import MessageList from './MessageList';

type HookMessageRef = {
  update: (updateProps: MessageProps) => void;
};

export type MessageHookProps = Omit<MessageProps, 'visible' | 'defaultVisible'>;

export type MessageHookUpdate = (
  props: Partial<MessageHookProps> | ((prev: MessageHookProps) => Partial<MessageHookProps>),
) => void;

export type MessageHookReturnType = Promise<void> & {
  destroy: () => void;
  update: MessageHookUpdate;
  isDestoryed: () => boolean;
};

const createHookMessage = (props: MessageHookProps) => {
  const HookMessage = forwardRef<HookMessageRef>((_, ref) => {
    const [messageProps, setMessageProps] = useState<MessageHookProps>(props);

    useImperativeHandle(ref, () => {
      return {
        update(updateProps) {
          setMessageProps(updateProps);
        },
      };
    });

    return <Message {...messageProps} />;
  });

  if (!isProduction) {
    HookMessage.displayName = 'HookMessage';
  }

  return HookMessage;
};

export type MessageHookOptions = {
  top: number;
  maxCount: number;
  container: PortalContainerType<HTMLElement>;
};

let uuid = 0;

const DEFAULT_CONTAINER = () => document.body;

const useMessage = ({
  top = 8,
  container = DEFAULT_CONTAINER,
  maxCount = 0,
}: Partial<MessageHookOptions> = {}) => {
  const [messages, setMessages] = useState<Array<ReactElement>>([]);
  const destorysRef = useRef<Array<() => void>>([]);

  const method = useCallback(
    (props: MessageHookProps | string, type?: MessageType): MessageHookReturnType => {
      const parsedProps = typeof props === 'string' ? { content: props } : { ...props };

      if (type) {
        parsedProps.type = type;
      }

      let currentProps: MessageProps = {
        ...parsedProps,
        visible: undefined,
        defaultVisible: true,
        style: {
          zIndex: increaseZindex(),
          ...parsedProps.style,
        },
      };

      let promiseResolve: () => void | undefined;

      const onAfterClosedWrap = (onAfterClosed?: () => void) => () => {
        destroyDOM();
        destorysRef.current = destorysRef.current.filter((it) => it !== destroy);
        promiseResolve?.();
        onAfterClosed?.();
      };

      const HookMessage = createHookMessage({
        ...currentProps,
        onAfterClosed: onAfterClosedWrap(currentProps.onAfterClosed),
      });

      const ref = createRef<HookMessageRef>();

      let destroyState = false;

      const message = <HookMessage key={`message${uuid++}`} ref={ref} />;

      const destroyDOM = () => {
        setMessages((prev) => prev.filter((it) => it !== message));
        destroyState = true;
      };

      const render = (renderProps: MessageProps) => {
        if (destroyState) {
          return warningLog(
            true,
            `The message instance was destroyed, please do not update or destroy it again.`,
          );
        }
        ref.current?.update({
          ...renderProps,
          onAfterClosed: onAfterClosedWrap(renderProps.onAfterClosed),
        });
      };

      const update: MessageHookUpdate = (updateProps) => {
        const newProps =
          typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
        currentProps = { ...currentProps, ...newProps, visible: undefined, defaultVisible: true };

        render(currentProps);
      };

      const destroy = () => {
        render({
          ...currentProps,
          visible: false,
        });
      };

      destorysRef.current.push(destroy);

      setMessages((prev) => [...prev, message]);

      const destroyFns = destorysRef.current;

      if (maxCount > 0 && maxCount < destroyFns.length) {
        const needDestroyedMessages = destroyFns.slice(0, destroyFns.length - maxCount);

        needDestroyedMessages.forEach((it) => it());
      }

      const promise = new Promise<void>((resolve) => {
        promiseResolve = resolve;
      }) as MessageHookReturnType;

      promise.update = update;
      promise.destroy = destroy;
      promise.isDestoryed = () => destroyState;

      return promise;
    },
    [maxCount],
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
        const destroyFns = destorysRef.current;
        let fn = destroyFns.pop();
        while (fn) {
          fn();
          fn = destroyFns.pop();
        }
      },
    }),
    [method],
  );

  const holder = (
    <MessageList top={top} container={container}>
      {messages}
    </MessageList>
  );

  return [methods, holder] as const;
};

export default useMessage;
