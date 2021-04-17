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
    dark: indigo[200],
  },
  secondary: {
    light: pink[500],
    dark: pink[200],
  },
  error: {
    light: red[500],
    dark: red[200],
  },
  warning: {
    light: orange[500],
    dark: orange[200],
  },
  info: {
    light: blue[500],
    dark: blue[200],
  },
  success: {
    light: green[500],
    dark: green[200],
  },
};

export default themes;
