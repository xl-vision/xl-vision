import createColors, { Color } from './color';
import createAnimation, { Animation } from './animation';
import createTypography, { Typography } from './typography';
import mixins from './mixins';
import createElevations from './elevations';
import createBreakpoints, { Breakpoints } from './breakpoints';

export type BaseTheme = Partial<{
  color: Color;
  animation: Animation;
  typography: Typography;
  breakpoints: Breakpoints;
  clsPrefix: string;
}>;

export type Theme = ReturnType<typeof createTheme>;

const createTheme = (theme: BaseTheme = {}) => {
  const { color, animation, typography, breakpoints, clsPrefix = 'xl' } = theme;

  const outputColor = createColors(color);
  const outputAnimation = createAnimation(animation);
  const outputTypography = createTypography(typography);
  const outputBreakpoints = createBreakpoints(breakpoints);

  const elevations = createElevations();

  return {
    color: outputColor,
    animation: outputAnimation,
    typography: outputTypography,
    breakpoints: outputBreakpoints,
    mixins,
    elevations,
    clsPrefix,
  };
};

export default createTheme;
