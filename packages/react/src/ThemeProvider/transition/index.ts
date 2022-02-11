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

const genTransition = (
  name: keyof React.CSSProperties | Array<keyof React.CSSProperties>,
  duration: string,
  func: string,
  delay: string = '',
) => {
  const names = Array.isArray(name) ? name : [name];
  return names
    .map((it) => it.replace(/\B([A-Z])/g, (letter) => `-${letter.toLowerCase()}`))
    .map((it) => `${it} ${duration} ${delay} ${func}`)
    .join(',');
};

const createTransition = (transition: Transition = {}) => {
  const { functions = defaultFunctions, durations = defaultDurations } = transition;

  const standard = (
    name: keyof React.CSSProperties | Array<keyof React.CSSProperties>,
    duration = durations.standard,
    delay = '0ms',
  ) => genTransition(name, duration, functions.standard, delay);

  const enter = (
    name: keyof React.CSSProperties | Array<keyof React.CSSProperties>,
    duration = durations.enter,
    delay = '0ms',
  ) => genTransition(name, duration, functions.deceleration, delay);

  const leavePermanent = (
    name: keyof React.CSSProperties | Array<keyof React.CSSProperties>,
    duration = durations.leave,
    delay = '0ms',
  ) => genTransition(name, duration, functions.acceleration, delay);

  const leaveTemporary = (
    name: keyof React.CSSProperties | Array<keyof React.CSSProperties>,
    duration = durations.leave,
    delay = '0ms',
  ) => genTransition(name, duration, functions.sharp, delay);

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
