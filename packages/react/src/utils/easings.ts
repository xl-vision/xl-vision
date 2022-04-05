// Easing Functions - inspired from http://gizma.com/easing/

export const easeInOutCubic = (
  currentTime: number,
  totalTime: number,
  startDistance: number,
  endDistance: number,
) => {
  const t = currentTime / totalTime;

  const y = t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

  return y * (endDistance - startDistance) + startDistance;
};

export const linear = (
  currentTime: number,
  totalTime: number,
  startDistance: number,
  endDistance: number,
) => {
  return (currentTime / totalTime) * (endDistance - startDistance) + startDistance;
};

export const easeInCubic = (
  currentTime: number,
  totalTime: number,
  startDistance: number,
  endDistance: number,
) => {
  const t = currentTime / totalTime;

  const y = t ** 3;

  return y * (endDistance - startDistance) + startDistance;
};

export const easeOutCubic = (
  currentTime: number,
  totalTime: number,
  startDistance: number,
  endDistance: number,
) => {
  const t = currentTime / totalTime - 1;

  const y = t * t * t + 1;

  return y * (endDistance - startDistance) + startDistance;
};
