import { deepMerge } from '@xl-vision/utils';
import { DeepPartial } from '../../utils/types';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type Breakpoints = {
  values: Record<Breakpoint, number>;
  unit: string;
  column: number;
};

const defaultBreakpoints: Breakpoints = {
  values: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
  column: 24,
  unit: 'px',
};

const createBreakpoints = (breakpoints: DeepPartial<Breakpoints> = {}) => {
  const { values, column, unit } = deepMerge(defaultBreakpoints, breakpoints, { clone: true });

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
