export type Breakpoints = Partial<{
  values: {
    [key: string]: number;
  };
  unit: string;
  columns: number;
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
    columns = 24,
    unit = 'px',
  } = breakpoints;

  return {
    values,
    unit,
    columns,
  };
};

export default createBreakpoints;
