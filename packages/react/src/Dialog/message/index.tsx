import ReactDOM from 'react-dom';
import React from 'react';
import { isServer } from '../../utils/env';
import MessageDialog, { MessageDialogProps, MessageDialogRef } from './MessageDialog';
import { voidFn } from '../../utils/function';
import warning from '../../utils/warning';

export interface MessageDialogFunctionProps extends MessageDialogProps {
  onClosed?: (isDestroy?: true) => void;
}

export default <
  K extends keyof MessageDialogFunctionProps,
  D = Pick<MessageDialogFunctionProps, K>,
  P = Omit<MessageDialogFunctionProps, K> & Partial<D>
>(
  props: P,
  defaultProps: D,
) => {
  if (isServer) {
    return {
      destroy: voidFn,
      update: voidFn,
    };
  }

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps: MessageDialogFunctionProps = {
    ...defaultProps,
    ...props,
  };

  let isDestoryed = false;

  const messgaeDialogRef: {
    current: MessageDialogRef | null;
  } = { current: null };

  const render = (renderProps: MessageDialogProps) => {
    if (isDestoryed) {
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

  const update = (updateProps: P | ((p: MessageDialogFunctionProps) => P)) => {
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
    isDestoryed = true;
    if (messgaeDialogRef.current?.visible) {
      destroyDOM();
      return;
    }
    const { onClosed } = currentProps;
    render({
      ...currentProps,
      visible: false,
      onClosed: () => {
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
