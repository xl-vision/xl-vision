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
import Message, { MessageProps } from './Message';
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

export type MessageHookOptions = Partial<{
  top: number;
  maxCount: number;
  container: PortalContainerType<HTMLElement>;
}>;

let uuid = 0;

const DEFAULT_CONTAINER = () => document.body;

const useMessage = ({
  top = 8,
  container = DEFAULT_CONTAINER,
  maxCount = 0,
}: MessageHookOptions = {}) => {
  const [messages, setMessages] = useState<Array<ReactElement>>([]);
  const destorysRef = useRef<Array<() => void>>([]);

  const method = useCallback(
    (props: MessageHookProps): MessageHookReturnType => {
      let promiseResolve: () => void | undefined;

      let currentProps: MessageProps = {
        ...props,
        visible: undefined,
        defaultVisible: true,
        style: {
          zIndex: increaseZindex(),
          ...props.style,
        },
        onAfterClosed: () => {
          props.onAfterClosed?.();
          destroyDOM();
          promiseResolve?.();
        },
      };
      const HookMessage = createHookMessage(currentProps);

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
        ref.current?.update(renderProps);
      };

      const update: MessageHookUpdate = (updateProps) => {
        const newProps =
          typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
        currentProps = { ...currentProps, ...newProps, visible: undefined, defaultVisible: true };

        const { onAfterClosed } = currentProps;

        currentProps.onAfterClosed = () => {
          onAfterClosed?.();
          destroyDOM();
        };
        render(currentProps);
      };

      const destroy = () => {
        render({
          ...currentProps,
          visible: false,
          onAfterClosed() {
            currentProps.onAfterClosed?.();
            destroyDOM();
          },
        });
      };

      destorysRef.current.push(destroy);

      setMessages((prev) => [...prev, message]);

      const destroyFns = destorysRef.current;

      if (maxCount < destroyFns.length) {
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
      open: (props: MessageHookProps | string) =>
        method(typeof props === 'string' ? { content: props } : props),
      loading: (props: Omit<MessageHookProps, 'type'> | string) =>
        method(
          typeof props === 'string'
            ? { content: props, type: 'loading' }
            : { ...props, type: 'loading' },
        ),
      error: (props: Omit<MessageHookProps, 'type'> | string) =>
        method(
          typeof props === 'string'
            ? { content: props, type: 'error' }
            : { ...props, type: 'error' },
        ),
      info: (props: Omit<MessageHookProps, 'type'> | string) =>
        method(
          typeof props === 'string' ? { content: props, type: 'info' } : { ...props, type: 'info' },
        ),
      success: (props: Omit<MessageHookProps, 'type'> | string) =>
        method(
          typeof props === 'string'
            ? { content: props, type: 'success' }
            : { ...props, type: 'success' },
        ),
      warning: (props: Omit<MessageHookProps, 'type'> | string) =>
        method(
          typeof props === 'string'
            ? { content: props, type: 'warning' }
            : { ...props, type: 'warning' },
        ),
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
