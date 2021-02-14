import { indigo, pink, red, blue, green, orange } from '../palette';

export type ThemeColor = {
  light: string;
  main: string;
  dark: string;
};

export type ThemeColors = {
  primary: ThemeColor;
  secondary: ThemeColor;
  error: ThemeColor;
  warning: ThemeColor;
  info: ThemeColor;
  success: ThemeColor;
};

const themes: ThemeColors = {
  primary: {
    light: indigo[300],
    main: indigo[500],
    dark: indigo[700],
  },
  secondary: {
    light: pink.A200,
    main: pink.A400,
    dark: pink.A700,
  },
  error: {
    light: red[300],
    main: red[500],
    dark: red[700],
  },
  warning: {
    light: orange[300],
    main: orange[500],
    dark: orange[700],
  },
  info: {
    light: blue[300],
    main: blue[500],
    dark: blue[700],
  },
  success: {
    light: green[300],
    main: green[500],
    dark: green[700],
  },
};

export default themes;
