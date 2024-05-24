import { TinyColor, isProduction, warning } from '@xl-vision/utils';
import {
  Colors,
  ThemeVariant,
  ThemeColors,
  TextVariant,
  BackgroundVariant,
  DividerVariant,
} from '../../../ThemeProvider';
import { Palette } from '../../palettes';

export type ColorInput = {
  background: string;
  contrastThreshold: number;
  inverseText: string;
  opacity: {
    disabled: number;
    ripple: number;
  };
  text: string;
  themes: Record<ThemeVariant, Palette>;
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
    hover: backgroundTinyColor[method](6).toHexString(true),
    focus: backgroundTinyColor[method](6).toHexString(true),
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
    const patterns = themes[themeVariant];

    outputThemes[themeVariant] = {
      foreground: {
        default: patterns[500],
        hover: dark ? patterns[400] : patterns[600],
        active: dark ? patterns[300] : patterns[700],
        focus: dark ? patterns[400] : patterns[600],
        dragged: dark ? patterns[700] : patterns[300],
        disabled: dark ? patterns[800] : patterns[200],
      },
      background: {
        default: dark ? patterns[950] : patterns[50],
        hover: dark ? patterns[900] : patterns[100],
        focus: dark ? patterns[900] : patterns[100],
      },
      divider: {
        default: patterns[500],
        hover: dark ? patterns[600] : patterns[400],
        focus: dark ? patterns[600] : patterns[400],
      },
      text: getContrastText(patterns[500]),
      outline: new TinyColor(patterns[500]).setAlpha(0.2).toHexString(true),
    };
  });

  return {
    opacity,
    text: {
      ...outText,
      spotlight: getContrastText(outputBackground.spotlight).primary,
    },
    inverseText: outInverseText,
    themes: outputThemes,
    divider: outputDivider,
    background: outputBackground,
  };
};
