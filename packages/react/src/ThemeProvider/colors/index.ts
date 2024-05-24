export type ThemeVariant = 'primary' | 'error' | 'warning' | 'info' | 'success';

export type ForegroundActionVariant = ActionVariant | 'focus' | 'active' | 'dragged' | 'disabled';

export type ActionVariant = 'default' | 'hover';

export type TextVariant = 'primary' | 'secondary' | 'disabled' | 'hint';

export type BackgroundVariant = ActionVariant | 'paper' | 'mask' | 'spotlight' | 'popper';

export type DividerVariant = 'primary' | 'secondary';

export type ThemeColors = {
  foreground: Record<ForegroundActionVariant, string>;
  background: Record<ActionVariant, string>;
  divider: Record<ActionVariant, string>;
  text: Record<TextVariant, string>;
  outline: string;
};

export type Colors = {
  background: Record<BackgroundVariant, string>;
  text: Record<TextVariant, string>;
  inverseText: Record<TextVariant, string>;
  divider: Record<DividerVariant, string>;
  themes: Record<ThemeVariant, ThemeColors>;
  opacity: {
    ripple: number;
    disabled: number;
  };
  getContrastText: (bgColor: string) => Record<TextVariant, string>;
};

const createColors = (colors: Colors) => {
  return colors;
};

export default createColors;
