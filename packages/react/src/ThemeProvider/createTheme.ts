import { deepMerge } from '@xl-vision/utils';
import createBreakpoints, { Breakpoints } from './breakpoints';
import createColors, { Colors } from './colors';
import createElevations, { Elevations } from './elevations';
import createMixins from './mixins';
import createOverrideStyles, { OverrideStyles } from './overrideStyles';
import createSizes, { Sizes, SizeVariant } from './sizes';
import createTransitions, { Transitions } from './transitions';
import createTypography, { Typography } from './typography';
import { Locale } from '../locale';
import defaultTheme from '../themes/default';
import { DeepPartial } from '../types';

export type BaseTheme = {
  breakpoints: Breakpoints;
  clsPrefix: string;
  colors: Colors;
  elevations: Elevations;
  locale: Locale;
  size: SizeVariant;
  sizes: Sizes;
  transitions: Transitions;
  typography: Typography;
  overrideStyles?: OverrideStyles;
};

export type ThemeInput = DeepPartial<BaseTheme> & {
  variants?: DeepPartial<ThemeWithoutMixins>;
};

export type ThemeWithoutMixins = ReturnType<typeof createThemeWithoutMixins>;

export type Theme = ReturnType<typeof createTheme>;

const createThemeWithoutMixins = (themeInput?: BaseTheme) => {
  const {
    colors,
    overrideStyles,
    breakpoints,
    elevations,
    sizes,
    transitions,
    typography,
    ...others
  } = deepMerge(defaultTheme, themeInput, {
    clone: true,
  });

  return {
    ...others,
    colors: createColors(colors),
    overrideStyles: createOverrideStyles(overrideStyles),
    breakpoints: createBreakpoints(breakpoints),
    elevations: createElevations(elevations),
    sizes: createSizes(sizes),
    transitions: createTransitions(transitions),
    typography: createTypography(typography),
  };
};

const createTheme = (theme: ThemeInput = {}) => {
  let themeWithoutMixins = createThemeWithoutMixins(
    deepMerge(defaultTheme, theme, { clone: true }),
  );

  if (theme.variants) {
    themeWithoutMixins = deepMerge(themeWithoutMixins, theme.variants, { clone: true });
  }

  return {
    ...themeWithoutMixins,
    mixins: createMixins(themeWithoutMixins),
  };
};

export default createTheme;
