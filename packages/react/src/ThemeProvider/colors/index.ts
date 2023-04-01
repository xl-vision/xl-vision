export type ThemeVariant = 'primary' | 'error' | 'warning' | 'info' | 'success';

export type ActionVariant = 'enabled' | 'hover' | 'focus' | 'active' | 'dragged' | 'disabled';

export type BackgroundActionVariant = 'enabled' | 'hover' | 'focus';

export type TextVariant = 'primary' | 'secondary' | 'disabled' | 'hint';

export type BackgroundVariant = 'default' | 'paper' | 'mask' | 'spotlight' | 'popper';

export type DividerVariant = 'primary' | 'secondary';

export type ThemeColors = {
  foreground: Record<ActionVariant, string>;
  background: Record<BackgroundActionVariant, string>;
  divider: Record<DividerVariant, string>;
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
