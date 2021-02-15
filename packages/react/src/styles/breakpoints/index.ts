export type Breakpoints = Partial<{
  values: {
    [key: string]: number;
  };
  unit: string;
}>;

const createBreakpoints = (breakpoints: Breakpoints = {}) => {
  const {
    values = {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
    unit = 'px',
  } = breakpoints;

  return {
    values,
    unit,
  };
};

export default createBreakpoints;
