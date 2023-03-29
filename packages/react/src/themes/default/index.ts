import { BaseTheme } from '../../ThemeProvider';
import { createColors } from '../shared/colors';

const colors = createColors({
  contrastThreshold: 3,
  text: '#000',
  inverseText: '#fff',
  background: '#fff',
  opacity: {
    disabled: 0.3,
  },
  themes: {
    primary: '#1068f4',
    error: '#eb1919',
    warning: '#f59e0b',
    info: '#66768d',
    success: '#22c85f',
  },
});

const theme: BaseTheme = {
  clsPrefix: 'xl',
  size: 'middle',
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
      long: '375',
    },
  },
  sizes: {
    small: {
      borderRadius: 3,
      border: 1,
      padding: { y: 4, x: 10 },
      fontSize: 0.75,
    },
    middle: {
      borderRadius: 4,
      border: 1,
      padding: { y: 6, x: 12 },
      fontSize: 1,
    },
    large: {
      borderRadius: 6,
      border: 1,
      padding: { y: 8, x: 22 },
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
  elevations: {
    0: 'none',
    1: '',
    2: '',
    3: '',
  },
};

export default theme;
