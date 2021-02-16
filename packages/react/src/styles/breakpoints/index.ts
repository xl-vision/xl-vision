export type Breakpoints = Partial<{
  values: Record<string, number>;
  unit: string;
  column: number;
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
    column = 24,
    unit = 'px',
  } = breakpoints;

  return {
    values,
    unit,
    column,
  };
};

export default createBreakpoints;
