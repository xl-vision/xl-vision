import { deepMerge } from '@xl-vision/utils';
import createColors, { Colors } from './color';
import createOverrideStyles, { OverrideStyles } from './overrideStyles';
import defaultTheme from '../themes/default';
import { DeepPartial } from '../utils/types';

export type BaseTheme = {
  prefixCls: string;
  colors: Colors;
};

export type ThemeInput = DeepPartial<BaseTheme> & {
  overrideStyles?: OverrideStyles;
};

export type Theme = ReturnType<typeof createTheme>;

const createTheme = (themeInput?: ThemeInput) => {
  const { colors, overrideStyles } = deepMerge(defaultTheme, themeInput, { clone: true });
  return {
    colors: createColors(colors),
    overrideStyles: createOverrideStyles(overrideStyles),
  };
};

export default createTheme;
