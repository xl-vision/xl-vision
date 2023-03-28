export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type Breakpoints = {
  values: Record<Breakpoint, number>;
  unit: string;
  column: number;
};

const createBreakpoints = ({ values, column, unit }: Breakpoints) => {
  // 关键点，从小到大排序
  const points = Object.keys(values).sort(
    (k1, k2) => values[k1 as Breakpoint] - values[k2 as Breakpoint],
  );

  return {
    values,
    unit,
    column,
    points,
  };
};

export default createBreakpoints;
