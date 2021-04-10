import React from 'react';
import { isServer } from '../utils/env';
import { voidFn } from '../utils/function';
import { DialogProps } from './Dialog';

const destoryFunctions: Array<() => void> = [];

export type DialogMethodReturnType = {
  destroy: () => void;
  update: (props: DialogProps) => void;
};

export const method = (props: DialogProps): DialogMethodReturnType => {
  if (isServer) {
    return {
      destroy: voidFn,
      update: voidFn,
    };
  }
  const div = document.createElement('div')
  document.body.appendChild(div)

  
};
