export type Breakpoints = Partial<{
  values: Record<string, number>;
  unit: string;
  column: number;
}>;

const createBreakpoints = (breakpoints: Breakpoints = {}) => {
  const {
    values = {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1600,
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
