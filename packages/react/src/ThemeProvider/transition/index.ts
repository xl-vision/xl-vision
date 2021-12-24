import { CSSObject } from '@xl-vision/styled-engine';
import React from 'react';

const defaultFunctions = {
  deceleration: 'cubic-bezier(0, 0, 0.2, 1)',
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  acceleration: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

const defaultDurations = {
  shortest: '150ms',
  shorter: '200ms',
  short: '250ms',
  standard: '300ms',
  complex: '375',
  enter: '225ms',
  leave: '195ms',
};

export type Transition = Partial<{
  functions: typeof defaultFunctions;
  durations: typeof defaultDurations;
}>;

const createTransition = (transition: Transition = {}) => {
  const { functions = defaultFunctions, durations = defaultDurations } = transition;

  const standard = (
    name: keyof React.CSSProperties | Array<keyof React.CSSProperties>,
    duration = durations.standard,
    delay = '0ms',
  ) => {
    if (Array.isArray(name)) {
      return name.map((it) => `${it} ${duration} ${delay} ${functions.standard}`).join(',');
    }
    return `${name} ${duration} ${delay} ${functions.standard}`;
  };

  const enter = (name: string | Array<string>, duration = durations.enter, delay = '0ms') => {
    if (Array.isArray(name)) {
      return name.map((it) => `${it} ${duration} ${delay} ${functions.deceleration}`).join(',');
    }
    return `${name} ${duration} ${delay} ${functions.deceleration} `;
  };

  const leavePermanent = (
    name: keyof React.CSSProperties | Array<keyof React.CSSProperties>,
    duration = durations.leave,
    delay = '0ms',
  ) => {
    if (Array.isArray(name)) {
      return name.map((it) => `${it} ${duration} ${delay} ${functions.acceleration}`).join(',');
    }
    return `${name} ${duration} ${delay} ${functions.acceleration} `;
  };

  const leaveTemporary = (
    name: keyof React.CSSProperties | Array<keyof React.CSSProperties>,
    duration = durations.leave,
    delay = '0ms',
  ) => {
    if (Array.isArray(name)) {
      return name.map((it) => `${it} ${duration} ${delay} ${functions.sharp}`).join(',');
    }
    return `${name} ${duration} ${delay} ${functions.sharp} `;
  };

  const fadeIn = (className: string, duration = defaultDurations.enter): CSSObject => {
    return {
      [`${className}-enter-active`]: {
        transition: enter(['opacity', 'transform'], duration),
      },
      [`${className}-enter-from`]: {
        opacity: 0,
        transform: 'scale(0.8)',
      },
      [`${className}-enter-to`]: {
        opacity: 1,
        transform: 'scale(1)',
      },
    };
  };

  const fadeOut = (className: string, duration = defaultDurations.leave): CSSObject => {
    return {
      [`${className}-leave-active`]: {
        transition: leavePermanent(['opacity'], duration),
      },
      [`${className}-leave-from`]: {
        opacity: 1,
      },
      [`${className}-leave-to`]: {
        opacity: 0,
      },
    };
  };

  return {
    functions,
    durations,
    standard,
    enter,
    leavePermanent,
    leaveTemporary,
    fadeIn,
    fadeOut,
  } as const;
};

export default createTransition;
