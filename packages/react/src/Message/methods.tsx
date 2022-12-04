import ReactDOM from 'react-dom';
import { createRef, forwardRef, useImperativeHandle, useState } from 'react';
import { isProduction } from '@xl-vision/utils';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import useMessage, { MessageHookOptions, MessageHookProps } from './useMessage';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import { MessageType } from './Message';

export type MessageMethodProps = MessageHookProps;

export type MessageMethodUpdate = (
  props: Partial<MessageMethodProps> | ((prev: MessageMethodProps) => Partial<MessageMethodProps>),
) => void;

export type MessageMethodReturnType = Promise<void> & {
  destroy: () => void;
  update: MessageMethodUpdate;
  isDestoryed: () => boolean;
};

export type MessageConfig = Partial<
  MessageHookOptions & {
    themeProviderProps: Omit<ThemeProviderProps, 'children'>;
    configProviderProps: Omit<ConfigProviderProps, 'children'>;
  }
>;

type MethodMessage = {
  instance: ReturnType<typeof useMessage>[0];
  sync: () => void;
};

let messageConfig: MessageConfig = {};

export const setConfig = (config: MessageConfig) => {
  messageConfig = config;
  messageRef.current?.sync();
};

const MethodMessage = forwardRef<MethodMessage>((_, ref) => {
  const { configProviderProps, themeProviderProps, ...others } = messageConfig;

  const [configProps, setConfigProps] = useState(configProviderProps);
  const [themeProps, setThemeProps] = useState(themeProviderProps);
  const [hookProps, setHookProps] = useState<Partial<MessageHookOptions>>(others);

  const [methods, holder] = useMessage(hookProps);

  useImperativeHandle(ref, () => {
    return {
      instance: methods,
      sync() {
        const {
          configProviderProps: newConfigProps,
          themeProviderProps: newThemeProps,
          ...newOthers
        } = messageConfig;

        setConfigProps(newConfigProps);
        setThemeProps(newThemeProps);
        setHookProps(newOthers);
      },
    };
  });

  return (
    <ConfigProvider {...configProps}>
      <ThemeProvider {...themeProps}>{holder} </ThemeProvider>
    </ConfigProvider>
  );
});

if (!isProduction) {
  MethodMessage.displayName = 'MethodMessage';
}

let rootEl: HTMLElement | undefined;

const messageRef = createRef<MethodMessage>();

let count = 0;

const destroyDOM = () => {
  if (!rootEl) {
    return;
  }
  const unmountResult = ReactDOM.unmountComponentAtNode(rootEl);
  if (unmountResult && rootEl.parentNode) {
    rootEl.parentNode.removeChild(rootEl);
  }

  rootEl = undefined;
};

const method = (
  props: MessageMethodProps | string,
  type?: MessageType,
): MessageMethodReturnType => {
  const currentProps: MessageMethodProps =
    typeof props === 'string' ? { content: props } : { ...props };

  if (type) {
    currentProps.type = type;
  }

  let hookMethods: MessageMethodReturnType | undefined;

  let promiseResolve: () => void | undefined;

  if (!rootEl) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    rootEl = div;

    setTimeout(() => {
      ReactDOM.render(<MethodMessage ref={messageRef} />, div);
    });
  }

  count++;

  setTimeout(() => {
    hookMethods = messageRef.current?.instance.open({
      ...currentProps,
      onAfterClosed() {
        count--;
        if (count <= 0) {
          destroyDOM();
        }
        currentProps.onAfterClosed?.();
        promiseResolve?.();
      },
    });
  });

  const promise = new Promise<void>((resolve) => {
    promiseResolve = resolve;
  }) as MessageMethodReturnType;

  promise.update = (updateProps) => hookMethods?.update(updateProps);
  promise.destroy = () => hookMethods?.destroy();
  promise.isDestoryed = () => hookMethods?.destroy() || false;

  return promise;
};

export const open = (props: MessageMethodProps) => method(props);
export const info = (props: Omit<MessageMethodProps, 'type'> | string) => method(props, 'info');
export const success = (props: Omit<MessageMethodProps, 'type'> | string) =>
  method(props, 'success');
export const warning = (props: Omit<MessageMethodProps, 'type'> | string) =>
  method(props, 'warning');
export const error = (props: Omit<MessageMethodProps, 'type'> | string) => method(props, 'error');
export const loading = (props: Omit<MessageMethodProps, 'type'> | string) =>
  method(props, 'loading');

export const destroyAll = () => messageRef.current?.instance.destroyAll();
