import { isProduction, warning as warningLog } from '@xl-vision/utils';
import {
  forwardRef,
  useState,
  useImperativeHandle,
  ReactElement,
  createRef,
  useCallback,
  useMemo,
} from 'react';
import { increaseZindex } from '../utils/zIndexManger';
import messageConfig from './config';
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

let uuid = 0;

const useMessage = () => {
  const [messages, setMessages] = useState<Array<ReactElement>>([]);

  const method = useCallback((props: MessageHookProps): MessageHookReturnType => {
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
      const newProps = typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
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

    setMessages((prev) => [...prev, message]);

    const promise = new Promise<void>((resolve) => {
      promiseResolve = resolve;
    }) as MessageHookReturnType;

    promise.update = update;
    promise.destroy = destroy;
    promise.isDestoryed = () => destroyState;

    return promise;
  }, []);

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
    <MessageList top={messageConfig.top} container={messageConfig.container}>
      {messages}
    </MessageList>
  );

  return [methods, holder] as const;
};

export default useMessage;
