export type FontWeightKey = 'light' | 'regular' | 'medium' | 'bold';

export type Typography = Partial<{
  baseFontSize: number;
  fontFamily: string;
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    bold: number;
  };
}>;

const createTypography = (typography: Typography = {}) => {
  const {
    baseFontSize = 16,
    fontFamily = `'Roboto', 'Helvetica Neue', 'segoe ui', 'Arial', 'noto sans', sans-serif`,
    fontWeight = {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  } = typography;

  const pxToRem = (px: number) => `${(px / baseFontSize).toFixed(3)}rem`;

  const buildStyle = (
    size: number,
    lineHeight: number,
    fontWeightKey: FontWeightKey,
    letterSpacing: number,
    textDecoration = 'inherit',
    textTransform = 'inherit',
  ) => {
    return {
      fontSize: pxToRem(size),
      lineHeight,
      fontWeight: fontWeight[fontWeightKey],
      letterSpacing: `${(letterSpacing / size).toFixed(3)}em`,
      textDecoration,
      textTransform,
    };
  };
  const h1 = buildStyle(96, 1.167, 'light', -1.5);
  const h2 = buildStyle(60, 1.2, 'light', -0.5);
  const h3 = buildStyle(48, 1.167, 'regular', 0);
  const h4 = buildStyle(34, 1.235, 'regular', 0.25);
  const h5 = buildStyle(24, 1.334, 'regular', 0);
  const h6 = buildStyle(20, 1.6, 'medium', 0.25);
  const subtitle1 = buildStyle(16, 1.75, 'regular', 0.15);
  const subtitle2 = buildStyle(14, 1.57, 'medium', 0.1);
  const body1 = buildStyle(16, 1.5, 'regular', 0.5);
  const body2 = buildStyle(14, 1.3, 'regular', 0.25);
  const caption = buildStyle(12, 1.66, 'regular', 0.4);
  const button = buildStyle(14, 1.75, 'medium', 1.25, 'none', 'uppercase');
  const overline = buildStyle(12, 2.66, 'medium', 2, 'none', 'uppercase');

  return {
    baseFontSize,
    fontFamily,
    fontWeight,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    subtitle1,
    subtitle2,
    body1,
    body2,
    caption,
    button,
    overline,
  } as const;
};

export default createTypography;
