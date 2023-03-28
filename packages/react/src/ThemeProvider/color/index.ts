import { isProduction, TinyColor, warning } from '@xl-vision/utils';

export type ThemeVariant = 'primary' | 'error' | 'warning' | 'info' | 'success';

export type ActionVariant = 'enabled' | 'hover' | 'focus' | 'active' | 'dragged' | 'disabled';

export type BackgroundActionVariant = 'enabled' | 'hover' | 'focus';

export type TextVariant = 'primary' | 'secondary' | 'disabled' | 'hint';

export type BackgroundVariant = 'default' | 'paper' | 'mask' | 'spotlight';

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
    disabled: number;
  };
  contrastThreshold: number;
};

const createColors = ({ inverseText, text, contrastThreshold, ...others }: Colors) => {
  const contrastCache: Map<string, Record<TextVariant, string>> = new Map();

  const getContrastText = (bgColor: string) => {
    const cachedColors = contrastCache.get(bgColor);

    if (cachedColors) {
      return cachedColors;
    }

    const contrastColor =
      TinyColor.getContrastRatio(bgColor, inverseText.primary) >= contrastThreshold
        ? inverseText
        : text;

    contrastCache.set(bgColor, contrastColor);

    if (!isProduction) {
      const contrast = TinyColor.getContrastRatio(bgColor, contrastColor.primary);
      warning(
        contrast < 3,
        [
          `XL-VISION: The contrast ratio of ${contrast}:1 for ${contrastColor.primary} on ${bgColor}`,
          'falls below the WCAG recommended absolute minimum contrast ratio of 3:1.',
          'https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast',
        ].join('\n'),
      );
    }

    return contrastColor;
  };

  return {
    getContrastText,
    text,
    ...others,
  };
};

export default createColors;
