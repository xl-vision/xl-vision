export type ThemeVariant = 'primary' | 'error' | 'warning' | 'info' | 'success';

export type ForegroundActionVariant = ActionVariant | 'active' | 'dragged' | 'disabled';

export type ActionVariant = 'default' | 'hover' | 'focus';

export type TextVariant = 'primary' | 'secondary' | 'disabled' | 'hint';

export type DefaultTextVariant = TextVariant | 'spotlight';

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
  text: Record<DefaultTextVariant, string>;
  inverseText: Record<TextVariant, string>;
  divider: Record<DividerVariant, string>;
  themes: Record<ThemeVariant, ThemeColors>;
  opacity: {
    ripple: number;
    disabled: number;
  };
};

const createColors = (colors: Colors) => {
  return colors;
};

export default createColors;
