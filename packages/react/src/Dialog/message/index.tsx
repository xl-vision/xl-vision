import ReactDOM from 'react-dom';
import React from 'react';
import { isServer } from '../../utils/env';
import MessageDialog, { MessageDialogProps, MessageDialogRef } from './MessageDialog';
import { voidFn } from '../../utils/function';
import warning from '../../utils/warning';

export interface MessageDialogFunctionProps extends MessageDialogProps {
  onClosed?: (isDestroy?: true) => void;
}

export type MessageDialogFunctionUpdate = (
  props:
    | Partial<MessageDialogFunctionProps>
    | ((prev: MessageDialogFunctionProps) => Partial<MessageDialogFunctionProps>),
) => void;

export type MessageDialogFunctionReturnType = {
  destroy: () => void;
  update: MessageDialogFunctionUpdate;
};

export default (props: MessageDialogFunctionProps): MessageDialogFunctionReturnType => {
  if (isServer) {
    return {
      destroy: voidFn,
      update: voidFn,
    };
  }

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps: MessageDialogFunctionProps = {
    ...props,
  };

  let destroyState = false;

  const messgaeDialogRef: {
    current: MessageDialogRef | null;
  } = { current: null };

  const render = (renderProps: MessageDialogProps) => {
    if (destroyState) {
      return warning(
        true,
        `The dialog instance was destroyed, please do not update or destroy it again.`,
      );
    }
    setTimeout(() => {
      ReactDOM.render(
        <MessageDialog getContainer={null} {...renderProps} ref={messgaeDialogRef} />,
        div,
      );
    });
  };

  const update: MessageDialogFunctionUpdate = (updateProps) => {
    const newProps = typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
    currentProps = { ...currentProps, ...newProps };

    render(currentProps);
  };

  const destroyDOM = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const destroy = () => {
    if (!messgaeDialogRef.current?.visible) {
      destroyState = true;
      destroyDOM();
      return;
    }
    const { onClosed } = currentProps;
    render({
      ...currentProps,
      visible: false,
      onClosed: () => {
        destroyState = true;
        onClosed?.(true);
        destroyDOM();
      },
    });
  };

  render(currentProps);

  return {
    destroy,
    update,
  };
};
