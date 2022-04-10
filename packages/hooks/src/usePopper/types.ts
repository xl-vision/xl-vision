export type Mode = 'fixed' | 'absolute';

export type Reference = {
  getBoundingClientRect: () => { x: number; y: number; width: number; height: number };
};
