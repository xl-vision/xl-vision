import { TinyColor, isProduction, warning } from '@xl-vision/utils';
import createPatterns from './createPatterns';
import {
  Colors,
  ThemeVariant,
  ThemeColors,
  TextVariant,
  BackgroundVariant,
  DividerVariant,
  BackgroundActionVariant,
} from '../../../ThemeProvider';

export type ColorInput = {
  background: string;
  contrastThreshold: number;
  inverseText: string;
  opacity: {
    disabled: number;
    ripple: number;
  };
  text: string;
  themes: Record<ThemeVariant, string>;
  dark?: boolean;
};

export const createColors = ({
  background,
  text,
  inverseText,
  themes,
  opacity,
  contrastThreshold,
  dark,
}: ColorInput): Colors => {
  const textTinyColor = new TinyColor(text);
  const inverseTextTinyColor = new TinyColor(inverseText);
  const backgroundTinyColor = new TinyColor(background);

  const outText: Record<TextVariant, string> = {
    primary: textTinyColor.setAlpha(0.88).toHexString(true),
    secondary: textTinyColor.setAlpha(0.65).toHexString(true),
    disabled: textTinyColor.setAlpha(0.25).toHexString(true),
    hint: textTinyColor.setAlpha(0.38).toHexString(true),
  };
  const outInverseText: Record<TextVariant, string> = {
    primary: inverseTextTinyColor.setAlpha(0.88).toHexString(true),
    secondary: inverseTextTinyColor.setAlpha(0.65).toHexString(true),
    disabled: inverseTextTinyColor.setAlpha(0.25).toHexString(true),
    hint: inverseTextTinyColor.setAlpha(0.38).toHexString(true),
  };

  const method = dark ? 'lighten' : 'darken';

  const outputBackground: Record<BackgroundVariant, string> = {
    default: backgroundTinyColor[method](4).toHexString(true),
    paper: backgroundTinyColor[method](0).toHexString(true),
    popper: backgroundTinyColor[method](dark ? 12 : 0).toHexString(true),
    spotlight: '#1e1e1e',
    mask: 'rgba(0, 0, 0, 0.45)',
  };

  const outputBackgroundAction: Record<BackgroundActionVariant, string> = {
    enabled: backgroundTinyColor[method](0).toHexString(true),
    hover: backgroundTinyColor[method](6).toHexString(true),
    focus: backgroundTinyColor[method](10).toHexString(true),
  };

  const outputDivider: Record<DividerVariant, string> = {
    primary: backgroundTinyColor[method](15).toHexString(true),
    secondary: backgroundTinyColor[method](6).toHexString(true),
  };

  const outputThemes = {} as Record<ThemeVariant, ThemeColors>;

  const contrastCache: Map<string, Record<TextVariant, string>> = new Map();

  const getContrastText = (bgColor: string) => {
    const cachedColors = contrastCache.get(bgColor);

    if (cachedColors) {
      return cachedColors;
    }

    const contrastColor =
      TinyColor.getContrastRatio(bgColor, outInverseText.primary) >= contrastThreshold
        ? outInverseText
        : outText;

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

  Object.keys(themes).forEach((key) => {
    const themeVariant = key as ThemeVariant;
    const patterns = createPatterns(themes[themeVariant], {
      theme: dark ? 'dark' : 'default',
      backgroundColor: background,
    });

    outputThemes[themeVariant] = {
      foreground: {
        enabled: patterns[5],
        hover: patterns[4],
        active: patterns[6],
        focus: patterns[6],
        dragged: patterns[3],
        disabled: patterns[2],
      },
      background: {
        enabled: patterns[0],
        hover: patterns[1],
        focus: patterns[2],
      },
      divider: {
        primary: patterns[3],
        secondary: patterns[2],
      },
      text: getContrastText(patterns[5]),
      outline: new TinyColor(patterns[5]).setAlpha(0.2).toHexString(true),
    };
  });

  return {
    getContrastText,
    opacity,
    text: outText,
    inverseText: outInverseText,
    themes: outputThemes,
    divider: outputDivider,
    background: outputBackground,
    backgroundAction: outputBackgroundAction,
  };
};
