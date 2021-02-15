import { indigo, pink, red, blue, green, orange } from '../palette';

export type ThemeColor = {
  light: string;
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
    light: indigo[500],
    dark: indigo[700],
  },
  secondary: {
    light: pink.A400,
    dark: pink.A700,
  },
  error: {
    light: red[500],
    dark: red[700],
  },
  warning: {
    light: orange[500],
    dark: orange[700],
  },
  info: {
    light: blue[500],
    dark: blue[700],
  },
  success: {
    light: green[500],
    dark: green[700],
  },
};

export default themes;
