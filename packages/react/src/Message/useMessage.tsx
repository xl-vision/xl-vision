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
import createMessage, { MessageProps, MessageType } from './createMessage';
import MessageList from './MessageList';

type HookMessageRef = {
  update: (updateProps: MessageProps) => void;
};

export type MessageHookProps = Omit<MessageProps, 'visible' | 'defaultVisible'>;

export type MessageHookUpdate = (
  props: Partial<MessageHookProps> | ((prev: MessageHookProps) => Partial<MessageHookProps>),
) => void;

export type MessageHookReturnType = {
  destroy: () => void;
  update: MessageHookUpdate;
  isDestoryed: () => boolean;
};

const createHookMessage = (props: MessageHookProps, type?: MessageType) => {
  const Message = createMessage(type);

  const HookMessage = forwardRef<HookMessageRef>((_, ref) => {
    const [innerConfig, setInnerConfig] = useState<MessageHookProps>(props);

    useImperativeHandle(ref, () => {
      return {
        update(updateProps) {
          setInnerConfig(updateProps);
        },
      };
    });

    return <Message {...innerConfig} />;
  });

  if (!isProduction) {
    HookMessage.displayName = 'HookMessage';
  }

  return HookMessage;
};

let uuid = 0;

const useMessage = () => {
  const [messages, setMessages] = useState<Array<ReactElement>>([]);

  const method = useCallback(
    (props: MessageHookProps, type?: MessageType): MessageHookReturnType => {
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
        },
      };
      const Message = createHookMessage(currentProps, type);

      const ref = createRef<HookMessageRef>();

      let destroyState = false;

      const message = <Message key={`dialog${uuid++}`} ref={ref} />;

      const destroyDOM = () => {
        setMessages((prev) => prev.filter((it) => it !== message));
        destroyState = true;
      };

      const render = (renderProps: MessageProps) => {
        if (destroyState) {
          return warningLog(
            true,
            `The dialog instance was destroyed, please do not update or destroy it again.`,
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

      setMessages((prev) => [...prev, message]);

      return {
        update,
        destroy,
        isDestoryed: () => destroyState,
      };
    },
    [],
  );

  const methods = useMemo(
    () => ({
      open: (props: MessageHookProps) => method(props),
      loading: (props: MessageHookProps) => method(props, 'loading'),
      error: (props: MessageHookProps) => method(props, 'error'),
      info: (props: MessageHookProps) => method(props, 'info'),
      success: (props: MessageHookProps) => method(props, 'success'),
      warning: (props: MessageHookProps) => method(props, 'warning'),
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
