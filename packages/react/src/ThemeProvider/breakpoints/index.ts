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

  // 关键点，从小到大排序
  const points = Object.keys(values).sort((k1, k2) => values[k1] - values[k2]);

  return {
    values,
    unit,
    column,
    points,
  };
};

export default createBreakpoints;
