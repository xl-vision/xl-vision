import { red, blue, green, orange, purple, lightBlue } from '../palette';

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
    light: blue[700],
    dark: blue[800],
  },
  secondary: {
    light: purple[300],
    dark: purple[700],
  },
  error: {
    light: red[400],
    dark: red[800],
  },
  warning: {
    light: orange[500],
    dark: orange[900],
  },
  info: {
    light: lightBlue[500],
    dark: lightBlue[900],
  },
  success: {
    light: green[500],
    dark: green[900],
  },
};

export default themes;
