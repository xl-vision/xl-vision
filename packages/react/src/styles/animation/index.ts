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

export type Animation = Partial<{
  functions: typeof defaultFunctions;
  durations: typeof defaultDurations;
}>;

const createAnimation = (animation: Animation = {}) => {
  const { functions = defaultFunctions, durations = defaultDurations } = animation;

  const standard = (name: string, duration = durations.standard, delay = '0ms') => {
    return `${name} ${duration} ${delay} ${functions.standard} `;
  };

  const enter = (name: string, duration = durations.enter, delay = '0ms') => {
    return `${name} ${duration} ${delay} ${functions.deceleration} `;
  };

  const leavePermanent = (name: string, duration = durations.leave, delay = '0ms') => {
    return `${name} ${duration} ${delay} ${functions.acceleration} `;
  };

  const leaveTemporary = (name: string, duration = durations.leave, delay = '0ms') => {
    return `${name} ${duration} ${delay} ${functions.sharp} `;
  };

  return {
    functions,
    durations,
    standard,
    enter,
    leavePermanent,
    leaveTemporary,
  } as const;
};

export default createAnimation;
