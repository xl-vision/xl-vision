import createColors, { Color } from './color';
import createTransition, { Transition } from './transition';
import createTypography, { Typography } from './typography';
import mixins from './mixins';
import createElevations from './elevations';
import createBreakpoints, { Breakpoints } from './breakpoints';
import createOverrideStyles, { OverrideStyles } from './overrideStyles';
import createShape, { Shape } from './shape';

export type BaseTheme = Partial<{
  color: Color;
  transition: Transition;
  typography: Typography;
  breakpoints: Breakpoints;
  clsPrefix: string;
  overrideStyles: OverrideStyles;
  shape: Shape;
}>;

export type Theme = ReturnType<typeof createTheme>;

const createTheme = (theme: BaseTheme = {}) => {
  const {
    color,
    transition,
    typography,
    breakpoints,
    overrideStyles = {},
    clsPrefix = 'xl',
    shape,
  } = theme;

  const outputColor = createColors(color);
  const outputTransition = createTransition(transition);
  const outputTypography = createTypography(typography);
  const outputBreakpoints = createBreakpoints(breakpoints);
  const outputOverrideStyles = createOverrideStyles(overrideStyles);

  const outputShape = createShape(shape);

  const elevations = createElevations();

  return {
    color: outputColor,
    transition: outputTransition,
    typography: outputTypography,
    breakpoints: outputBreakpoints,
    mixins,
    elevations,
    clsPrefix,
    overrideStyles: outputOverrideStyles,
    shape: outputShape,
  };
};

export default createTheme;
