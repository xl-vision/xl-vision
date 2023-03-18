import createBreakpoints, { Breakpoints } from './breakpoints';
import createColors, { Color } from './color';
import createElevations from './elevations';
import createMixins from './mixins';
import createOverrideStyles, { OverrideStyles } from './overrideStyles';
import createStyleSize, { StyleSize } from './styleSize';
import createTransition, { Transition } from './transition';
import createTypography, { Typography } from './typography';
import { DeepPartial } from '../utils/types';

export type BaseTheme = DeepPartial<{
  color: Color;
  transition: Transition;
  typography: Typography;
  breakpoints: Breakpoints;
  styleSize: StyleSize;
}> & {
  overrideStyles?: OverrideStyles;
};

export type ThemeWithoutMixins = ReturnType<typeof createThemeWithoutMixins>;

export type Theme = ReturnType<typeof createTheme>;

const createThemeWithoutMixins = (theme: BaseTheme = {}) => {
  const { color, transition, typography, breakpoints, overrideStyles = {}, styleSize } = theme;

  const outputColor = createColors(color);
  const outputTransition = createTransition(transition);
  const outputTypography = createTypography(typography);
  const outputBreakpoints = createBreakpoints(breakpoints);
  const outputOverrideStyles = createOverrideStyles(overrideStyles);

  const outputStyleSize = createStyleSize(styleSize);

  const elevations = createElevations();

  return {
    color: outputColor,
    transition: outputTransition,
    typography: outputTypography,
    breakpoints: outputBreakpoints,
    elevations,
    overrideStyles: outputOverrideStyles,
    styleSize: outputStyleSize,
  };
};

const createTheme = (theme: BaseTheme = {}) => {
  const themeWithoutMixins = createThemeWithoutMixins(theme);

  const mixins = createMixins(themeWithoutMixins);

  return {
    ...themeWithoutMixins,
    mixins,
  };
};

export default createTheme;
