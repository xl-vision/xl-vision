import ReactDOM from 'react-dom';
import { isServer, noop, warning as warningLog } from '@xl-vision/utils';
import { ReactElement } from 'react';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import MessageList from './MessageList';
import messageConfig from './config';
import { MessageHookProps } from './useMessage';

export type BasicMessageMethodProps = MessageHookProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
};

export type MessageMethodProps = Omit<BasicMessageMethodProps, 'visible' | 'defaultVisible'>;

export type MessageMethodUpdate = (
  props: Partial<MessageMethodProps> | ((prev: MessageMethodProps) => Partial<MessageMethodProps>),
) => void;

export type MessageMethodReturnType = {
  destroy: () => void;
  update: MessageMethodUpdate;
  isDestoryed: () => boolean;
};

const destroyFunctions: Array<() => void> = [];

let nodes: Array<ReactElement> = [];

let rootNode: HTMLElement | undefined;

const method = (props: MessageMethodProps, type?: MessageType): MessageMethodReturnType => {
  if (isServer) {
    return {
      destroy: noop,
      update: noop,
      isDestoryed: () => false,
    };
  }

  const Message = createMessage(type);

  let currentProps: BasicMessageMethodProps = {
    ...props,
    visible: undefined,
    defaultVisible: true,
    onAfterClosed: () => {
      props.onAfterClosed?.();
      destroyDOM();
    },
  };

  let destroyState = false;

  let currentNode: ReactElement;

  const render = (renderProps: BasicMessageMethodProps) => {
    if (destroyState) {
      return warningLog(
        true,
        `The message instance was destroyed, please do not update or destroy it again.`,
      );
    }

    if (!rootNode) {
      rootNode = document.createElement('div');
      document.body.appendChild(rootNode);
    }

    const { configProviderProps, themeProviderProps, ...others } = renderProps;

    const index = nodes.findIndex((it) => it === currentNode);

    currentNode = (
      <ConfigProvider {...configProviderProps}>
        <ThemeProvider {...themeProviderProps}>
          <Message {...others} />
        </ThemeProvider>
      </ConfigProvider>
    );

    if (index > -1) {
      nodes[index] = currentNode;
    } else {
      if (messageConfig.maxCount && nodes.length >= messageConfig.maxCount) {
        const destoryFns = destroyFunctions.splice(0, nodes.length - messageConfig.maxCount + 1);
        destoryFns.forEach((it) => it());
      }
      nodes.push(currentNode);
    }

    setTimeout(() => {
      ReactDOM.render(
        <MessageList container={messageConfig.container} top={messageConfig.top}>
          {nodes}
        </MessageList>,
        rootNode!,
      );
    });
  };

  const update: MessageMethodUpdate = (updateProps) => {
    const { onAfterClosed, ...otherProps } =
      typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;

    currentProps = {
      ...currentProps,
      ...otherProps,
      visible: undefined,
      defaultVisible: true,
    };

    if (onAfterClosed) {
      currentProps.onAfterClosed = () => {
        onAfterClosed?.();
        destroyDOM();
      };
    }

    render(currentProps);
  };

  const destroyDOM = () => {
    nodes = nodes.filter((it) => it !== currentNode);

    const index = destroyFunctions.indexOf(destroy);
    if (index > -1) {
      destroyFunctions.splice(index, 1);
    }

    if (nodes.length) {
      setTimeout(() => {
        ReactDOM.render(
          <MessageList container={messageConfig.container} top={messageConfig.top}>
            {nodes}
          </MessageList>,
          rootNode!,
        );
      });

      return;
    }

    if (!rootNode) {
      return;
    }

    const unmountResult = ReactDOM.unmountComponentAtNode(rootNode);
    if (unmountResult && rootNode.parentNode) {
      rootNode.parentNode.removeChild(rootNode);
      rootNode = undefined;
    }
  };

  const destroy = () => {
    render({
      ...currentProps,
      visible: false,
    });
    destroyState = true;
  };

  destroyFunctions.push(destroy);

  render(currentProps);

  return {
    destroy,
    update,
    isDestoryed: () => destroyState,
  };
};

export const open = (props: MessageMethodProps) => method(props);
export const info = (props: MessageMethodProps) => method(props, 'info');
export const success = (props: MessageMethodProps) => method(props, 'success');
export const warning = (props: MessageMethodProps) => method(props, 'warning');
export const error = (props: MessageMethodProps) => method(props, 'error');
export const loading = (props: MessageMethodProps) => method(props, 'loading');

export const destroyAll = () => {
  let fn = destroyFunctions.pop();
  while (fn) {
    fn();
    fn = destroyFunctions.pop();
  }
};
