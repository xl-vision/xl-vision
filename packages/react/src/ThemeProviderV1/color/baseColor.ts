import { common } from '../palette';
import grey from '../palette/grey';

export type BaseColor = {
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    hint: string;
    icon: string;
  };
  divider: string;
  action: {
    enabled: number;
    hover: number;
    focus: number;
    selected: number;
    active: number;
    pressed: number;
    dragged: number;
    disabled: number;
  };
};

export const light: BaseColor = {
  background: {
    paper: common.white,
    default: grey[50],
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.54)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
    icon: 'rgba(0, 0, 0, 0.38)',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  action: {
    enabled: 0,
    hover: 0.08,
    focus: 0.12,
    selected: 0.08,
    active: 0.12,
    pressed: 0.12,
    dragged: 0.08,
    disabled: 0.38,
  },
};

export const dark: BaseColor = {
  background: {
    paper: grey[900],
    default: '#303030',
  },
  text: {
    primary: common.white,
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    hint: 'rgba(255, 255, 255, 0.5)',
    icon: 'rgba(255, 255, 255, 0.5)',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  action: {
    enabled: 0,
    hover: 0.08,
    focus: 0.12,
    selected: 0.16,
    active: 0.24,
    pressed: 0.32,
    dragged: 0.16,
    disabled: 0.38,
  },
};
