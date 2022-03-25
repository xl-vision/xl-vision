import ReactDOM from 'react-dom';
import React from 'react';
import { env } from '@xl-vision/utils';
import createMessageDialog, { MessageDialogType, MessageDialogProps } from './message';
import { noop } from '../utils/function';
import warningLog from '../utils/warning';
import ThemeProvider, { ThemeProviderProps } from '../ThemeProvider';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider';

export interface MessageDialogFunctionRenderProps extends MessageDialogProps, MessageDialogProps {
  themeProviderProps?: Omit<ThemeProviderProps, 'children'>;
  configProviderProps?: Omit<ConfigProviderProps, 'children'>;
}
export interface MessageDialogFunctionProps
  extends Omit<MessageDialogFunctionRenderProps, 'visible' | 'defaultVisible'> {}

export type MessageDialogFunctionUpdate = (
  props:
    | Partial<MessageDialogFunctionProps>
    | ((prev: MessageDialogFunctionProps) => Partial<MessageDialogFunctionProps>),
) => void;

export type MessageDialogFunctionReturnType = {
  destroy: () => void;
  update: MessageDialogFunctionUpdate;
};

const destroyFunctions: Array<() => void> = [];

const method = (
  props: MessageDialogFunctionProps,
  type?: MessageDialogType,
): MessageDialogFunctionReturnType => {
  if (env.isServer) {
    return {
      destroy: noop,
      update: noop,
    };
  }

  const Dialog = createMessageDialog(type);

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps: MessageDialogFunctionRenderProps = {
    ...props,
    visible: undefined,
    defaultVisible: true,
    onAfterClosed: () => {
      props.onAfterClosed?.();
      destroyDOM();
    },
  };

  let destroyState = false;

  const render = (renderProps: MessageDialogFunctionRenderProps) => {
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
            <Dialog container={null} {...others} />
          </ThemeProvider>
        </ConfigProvider>,
        div,
      );
    });
  };

  const update: MessageDialogFunctionUpdate = (updateProps) => {
    const newProps = typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;

    currentProps = {
      ...currentProps,
      ...newProps,
      visible: undefined,
      defaultVisible: true,
    };

    const { onAfterClosed: afterClose } = currentProps;

    currentProps.onAfterClosed = () => {
      afterClose?.();
      destroyDOM();
    };

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
    const { onAfterClosed: afterClose } = currentProps;
    render({
      ...currentProps,
      visible: false,
      onAfterClosed: () => {
        afterClose?.();
        destroyDOM();
      },
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

export const open = (props: MessageDialogFunctionProps) => method(props);
export const info = (props: MessageDialogFunctionProps) => method(props, 'info');
export const success = (props: MessageDialogFunctionProps) => method(props, 'success');
export const warning = (props: MessageDialogFunctionProps) => method(props, 'warning');
export const error = (props: MessageDialogFunctionProps) => method(props, 'error');
export const confirm = (props: MessageDialogFunctionProps) => method(props, 'confirm');

export const destroyAll = () => {
  let fn = destroyFunctions.pop();
  while (fn) {
    fn();
    fn = destroyFunctions.pop();
  }
};
