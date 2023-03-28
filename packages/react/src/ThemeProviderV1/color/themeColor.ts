import { red, blue, green, orange, purple, blueGrey } from '../palette';

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
    light: blue[500],
    dark: blue[700],
  },
  secondary: {
    light: purple[400],
    dark: purple[500],
  },
  error: {
    light: red[400],
    dark: red[700],
  },
  warning: {
    light: orange[500],
    dark: orange[900],
  },
  info: {
    light: blueGrey[500],
    dark: blueGrey[600],
  },
  success: {
    light: green[700],
    dark: green[900],
  },
};

export default themes;
