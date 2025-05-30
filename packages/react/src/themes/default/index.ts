import enUS from '../../locale/en-US';
import { BaseTheme } from '../../ThemeProvider';
import { amber, blue, green, neutral, red } from '../palettes';
import { createColors } from '../shared/colors';
import elevations from '../shared/elevations';

const colors = createColors({
  contrastThreshold: 3,
  text: '#000',
  inverseText: '#fff',
  background: '#fff',
  opacity: {
    disabled: 0.3,
    ripple: 0.3,
  },
  themes: {
    primary: blue,
    error: red,
    warning: amber,
    info: neutral,
    success: green,
  },
});

const theme: BaseTheme = {
  clsPrefix: 'xl',
  sizeVariant: 'middle',
  locale: enUS,
  colors,
  breakpoints: {
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
  },
  transitions: {
    functions: {
      deceleration: 'cubic-bezier(0, 0, 0.2, 1)',
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      acceleration: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    durations: {
      short: '250ms',
      standard: '300ms',
      long: '375ms',
    },
  },
  sizes: {
    small: {
      borderRadius: 3,
      border: 1,
      padding: { y: 3, x: 8 },
      fontSize: 0.75,
    },
    middle: {
      borderRadius: 4,
      border: 1,
      padding: { y: 4, x: 10 },
      fontSize: 1,
    },
    large: {
      borderRadius: 6,
      border: 1,
      padding: { y: 6, x: 18 },
      fontSize: 1.15,
    },
  },
  typography: {
    baseFontSize: 16,
    fontFamily: `'Roboto', 'Helvetica Neue', 'segoe ui', 'Arial', 'noto sans', sans-serif`,
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  elevations,
};

export default theme;
