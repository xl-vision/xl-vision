import { env } from '@xl-vision/utils';
import { dark as defaultDark, light as defaultLight, BaseColor } from './baseColor';
import defaultThemes, { ThemeColors } from './themeColor';
import { darken, getContrastRatio, lighten } from '../../utils/color';
import { Palette } from '../palette/palette';
import greyColor from '../palette/grey';

export type Color = Partial<{
  modes: {
    dark: BaseColor;
    light: BaseColor;
  };
  themes: ThemeColors;
  contrastThreshold: number;
  mode: 'dark' | 'light';
  grey: Palette;
}>;

export type Theme = BaseColor &
  Record<keyof BaseColor['action'], string> & {
    color: string;
  };

export type Themes = {
  [key in keyof ThemeColors]: Theme;
};

const createColors = (color: Color = {}) => {
  const {
    modes = {
      dark: defaultDark,
      light: defaultLight,
    },
    mode = 'light',
    contrastThreshold = 3,
    themes = defaultThemes,
    grey = greyColor,
  } = color;
  const { dark, light } = modes;

  const baseTheme = modes[mode];

  const constrastColorMap = new Map<string, BaseColor>();

  const getContrastColor = (background: string) => {
    let contrastColor = constrastColorMap.get(background);

    if (!contrastColor) {
      contrastColor =
        getContrastRatio(background, dark.text.primary) >= contrastThreshold ? dark : light;

      constrastColorMap.set(background, contrastColor);
    }

    if (!env.isProduction) {
      const contrast = getContrastRatio(background, contrastColor.text.primary);
      if (contrast < 3) {
        console.error(
          [
            `XL-VISION: The contrast ratio of ${contrast}:1 for ${contrastColor.text.primary} on ${background}`,
            'falls below the WCAG recommended absolute minimum contrast ratio of 3:1.',
            'https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast',
          ].join('\n'),
        );
      }
    }

    return contrastColor;
  };

  const emphasizedMap = new Map<string, Map<number, string>>();

  const emphasize = (bgColor: string, coefficient = 0.1) => {
    let actionMap = emphasizedMap.get(bgColor);
    if (!actionMap) {
      actionMap = new Map();
      emphasizedMap.set(bgColor, actionMap);
    }

    let stateColor = actionMap.get(coefficient);

    if (!stateColor) {
      const getColor = mode === 'dark' ? lighten : darken;
      stateColor = getColor(bgColor, coefficient);
      actionMap.set(coefficient, stateColor);
    }

    return stateColor;
  };

  const applyState = (bgColor: string, state: keyof BaseColor['action']) => {
    return emphasize(bgColor, baseTheme.action[state]);
  };

  const newThemes = {} as Themes;

  const { action } = baseTheme;

  Object.keys(themes).forEach((_themeKey) => {
    const themeKey = _themeKey as keyof ThemeColors;
    const theme = themes[themeKey];
    const themeColor = theme[mode];

    const obj = {
      color: themeColor,
      ...getContrastColor(themeColor),
    } as Theme;

    Object.keys(action).forEach((key) => {
      const actionKey = key as keyof BaseColor['action'];
      obj[actionKey] = applyState(themeColor, actionKey);
    });

    newThemes[themeKey] = obj;
  });

  return {
    ...baseTheme,
    mode,
    modes,
    themes: newThemes,
    grey,
    getContrastColor,
    emphasize,
    applyState,
  };
};

export default createColors;
