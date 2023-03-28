import { CSSObject, CSSProperties } from '@xl-vision/styled-engine';

export type TransitionDurationVariant = 'standard' | 'slow' | 'quick';

export type TransitionFunctionVariant = 'standard' | 'acceleration' | 'deceleration' | 'sharp';

export type Transitions = {
  durations: Record<TransitionDurationVariant, string>;
  functions: Record<TransitionFunctionVariant, string>;
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

const createTransitions = ({ functions, durations }: Transitions) => {
  const standard = (
    name: keyof CSSProperties | Array<keyof CSSProperties>,
    duration = durations.standard,
    delay = '0ms',
  ) => genTransition(name, duration, functions.standard, delay);

  const enter = (
    name: keyof CSSProperties | Array<keyof CSSProperties>,
    duration = durations.standard,
    delay = '0ms',
  ) => genTransition(name, duration, functions.deceleration, delay);

  const exit = (
    name: keyof CSSProperties | Array<keyof CSSProperties>,
    duration = durations.standard,
    delay = '0ms',
  ) => genTransition(name, duration, functions.acceleration, delay);

  const fadeIn = (className: string, duration = durations.standard): CSSObject => {
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

  const fadeOut = (className: string, duration = durations.standard): CSSObject => {
    return {
      [`${className}-exit-active`]: {
        transition: exit(['opacity', 'transform'], duration),
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
    exit,
    fadeIn,
    fadeOut,
  } as const;
};

export default createTransitions;
