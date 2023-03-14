import { CSSObject, CSSProperties } from '@xl-vision/styled-engine';
import { deepMerge } from '@xl-vision/utils';
import { DeepPartial } from '../../utils/types';

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
  exit: '195ms',
};

export type Transition = {
  functions: typeof defaultFunctions;
  durations: typeof defaultDurations;
};

const genTransition = (
  name: keyof CSSProperties | Array<keyof CSSProperties>,
  duration: string,
  func: string,
  delay = '',
) => {
  const names = Array.isArray(name) ? name : [name];
  return names
    .map((it) => it.replace(/\B([A-Z])/g, (letter) => `-${letter.toLowerCase()}`))
    .map((it) => `${it} ${duration} ${delay} ${func}`)
    .join(',');
};

const defaultTransition: Transition = {
  functions: defaultFunctions,
  durations: defaultDurations,
};

const createTransition = (transition: DeepPartial<Transition> = {}) => {
  const { functions, durations } = deepMerge(defaultTransition, transition, { clone: true });

  const standard = (
    name: keyof CSSProperties | Array<keyof CSSProperties>,
    duration = durations.standard,
    delay = '0ms',
  ) => genTransition(name, duration, functions.standard, delay);

  const enter = (
    name: keyof CSSProperties | Array<keyof CSSProperties>,
    duration = durations.enter,
    delay = '0ms',
  ) => genTransition(name, duration, functions.deceleration, delay);

  const exitPermanent = (
    name: keyof CSSProperties | Array<keyof CSSProperties>,
    duration = durations.exit,
    delay = '0ms',
  ) => genTransition(name, duration, functions.acceleration, delay);

  const exitTemporary = (
    name: keyof CSSProperties | Array<keyof CSSProperties>,
    duration = durations.exit,
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

  const fadeOut = (className: string, duration = defaultDurations.exit): CSSObject => {
    return {
      [`${className}-exit-active`]: {
        transition: exitPermanent(['opacity', 'transform'], duration),
      },
      [`${className}-exit-from`]: {
        transform: 'scale(1)',
        opacity: 1,
      },
      [`${className}-exit-to`]: {
        transform: 'scale(0.8)',
        opacity: 0,
      },
    };
  };

  return {
    functions,
    durations,
    standard,
    enter,
    exitPermanent,
    exitTemporary,
    fadeIn,
    fadeOut,
  } as const;
};

export default createTransition;
