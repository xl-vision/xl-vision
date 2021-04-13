import ReactDOM from 'react-dom';
import React from 'react';
import { isServer } from '../../utils/env';
import MethodDialog, { MethodDialogProps } from './MethodDialog';
import { voidFn } from '../../utils/function';

export type DialogMethodUpdate = (
  props: Partial<MethodDialogProps> | ((prev: MethodDialogProps) => Partial<MethodDialogProps>),
) => void;

export type DialogMethodReturnType = {
  destroy: () => void;
  update: DialogMethodUpdate;
};

export const method = (props: MethodDialogProps): DialogMethodReturnType => {
  if (isServer) {
    return {
      destroy: voidFn,
      update: voidFn,
    };
  }

  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentProps = { ...props };

  const render = () => {
    setTimeout(() => {
      ReactDOM.render(<MethodDialog getContainer={null} {...currentProps} />, div);
    });
  };

  const update: DialogMethodUpdate = (updateProps) => {
    const newProps = typeof updateProps === 'function' ? updateProps(currentProps) : updateProps;
    currentProps = { ...currentProps, ...newProps };
    render();
  };

  const destroyDOM = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const destroy = () => {
    const { onClosed } = currentProps;
    currentProps = {
      ...currentProps,
      visible: false,
      onClosed: () => {
        onClosed?.();
        destroyDOM();
      },
    };
    render();
  };

  render();

  return {
    destroy,
    update,
  };
};
