import { TinyColor } from '@xl-vision/utils';
import createPatterns from './createPatterns';
import {
  Colors,
  ThemeVariant,
  ThemeColors,
  TextVariant,
  BackgroundVariant,
  DividerVariant,
} from '../../../ThemeProvider';

export type ColorInput = {
  background: string;
  text: string;
  inverseText: string;
  themes: Record<ThemeVariant, string>;
  opacity: {
    disabled: number;
  };
  contrastThreshold: number;
};

export const createColors = ({
  background,
  text,
  inverseText,
  themes,
  opacity,
  contrastThreshold,
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
  const outputBackground: Record<BackgroundVariant, string> = {
    default: backgroundTinyColor.darken(4).toHexString(true),
    paper: backgroundTinyColor.darken(0).toHexString(true),
    spotlight: '#1e1e1e',
    mask: 'rgba(0, 0, 0, 0.45)',
  };
  const outputDivider: Record<DividerVariant, string> = {
    primary: backgroundTinyColor.darken(15).toHexString(true),
    secondary: backgroundTinyColor.darken(6).toHexString(true),
  };

  const outputThemes = {} as Record<ThemeVariant, ThemeColors>;

  Object.keys(themes).forEach((key) => {
    const themeVariant = key as ThemeVariant;
    const patterns = createPatterns(themes[themeVariant]);
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
        enabled: patterns[3],
        hover: patterns[2],
        focus: patterns[4],
      },
      divider: {
        primary: patterns[3],
        secondary: patterns[2],
      },
      text: outText,
      outline: new TinyColor(patterns[5]).setAlpha(0.1).toHexString(true),
    };
  });

  return {
    contrastThreshold,
    opacity,
    text: outText,
    inverseText: outInverseText,
    themes: outputThemes,
    divider: outputDivider,
    background: outputBackground,
  };
};
