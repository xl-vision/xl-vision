import ReactDOM from 'react-dom';
import { isServer, noop, warning as warningLog } from '@xl-vision/utils';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';
import createMessage, { MessageProps, MessageType } from './createMessage';

export type MessageMethodProps = MessageProps & {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
};

export type MessageMethodUpdate = (
  props: Partial<MessageMethodProps> | ((prev: MessageMethodProps) => Partial<MessageMethodProps>),
) => void;

export type MessageMethodReturnType = {
  destroy: () => void;
  update: MessageMethodUpdate;
};

const destroyFunctions: Array<() => void> = [];

const method = (props: MessageMethodProps, type?: MessageType): MessageMethodReturnType => {
  if (isServer) {
    return {
      destroy: noop,
      update: noop,
    };
  }

  const Message = createMessage(type);

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps: MessageMethodProps = {
    ...props,
    visible: undefined,
    defaultVisible: true,
    onAfterClosed: () => {
      props.onAfterClosed?.();
      destroyDOM();
    },
  };

  let destroyState = false;

  const render = (renderProps: MessageMethodProps) => {
    if (destroyState) {
      return warningLog(
        true,
        `The dialog instance was destroyed, please do not update or destroy it again.`,
      );
    }
    const { configProviderProps, themeProviderProps, ...others } = renderProps;

    setTimeout(() => {
      ReactDOM.render(
        <ConfigProvider {...configProviderProps}>
          <ThemeProvider {...themeProviderProps}>
            <Message container={null} {...others} />
          </ThemeProvider>
        </ConfigProvider>,
        div,
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
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const i = destroyFunctions.indexOf(destroy);
    if (i > -1) {
      destroyFunctions.splice(i, 1);
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
  };
};

export const open = (props: MessageMethodProps) => method(props);
export const info = (props: MessageMethodProps) => method(props, 'info');
export const success = (props: MessageMethodProps) => method(props, 'success');
export const warning = (props: MessageMethodProps) => method(props, 'warning');
export const error = (props: MessageMethodProps) => method(props, 'error');
export const confirm = (props: MessageMethodProps) => method(props, 'confirm');

export const destroyAll = () => {
  let fn = destroyFunctions.pop();
  while (fn) {
    fn();
    fn = destroyFunctions.pop();
  }
};
