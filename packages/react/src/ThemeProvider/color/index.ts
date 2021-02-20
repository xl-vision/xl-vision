import { isDevelopment } from '../../utils/env';
import { dark as defaultDark, light as defaultLight, BaseColor } from './baseColor';
import defaultThemes, { ThemeColors } from './themeColor';
import { getContrastRatio } from '../../utils/color';

export type Color = Partial<{
  modes: {
    dark: BaseColor;
    light: BaseColor;
  };
  themes: ThemeColors;
  contrastThreshold: number;
  mode: 'dark' | 'light';
}>;

export type Theme = BaseColor & {
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
  } = color;
  const { dark, light } = modes;

  // Use the same logic as
  // Bootstrap: https://github.com/twbs/bootstrap/blob/1d6e3710dd447de1a200f29e8fa521f8a0908f70/scss/_functions.scss#L59
  // and material-components-web https://github.com/material-components/material-components-web/blob/ac46b8863c4dab9fc22c4c662dc6bd1b65dd652f/packages/mdc-theme/_functions.scss#L54
  const getContrast = (background: string) => {
    const contrastText =
      getContrastRatio(background, dark.text.primary) >= contrastThreshold ? dark : light;

    if (isDevelopment) {
      const contrast = getContrastRatio(background, contrastText.text.primary);
      if (contrast < 3) {
        console.error(
          [
            `XL-VISION: The contrast ratio of ${contrast}:1 for ${contrastText.text.primary} on ${background}`,
            'falls below the WCAG recommended absolute minimum contrast ratio of 3:1.',
            'https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast',
          ].join('\n'),
        );
      }
    }

    return contrastText;
  };

  const base = modes[mode];

  const newThemes = {} as Themes;

  Object.keys(themes).forEach((key) => {
    const newKey = key as keyof ThemeColors;
    const theme = themes[newKey];
    const themeColor = theme[mode];
    newThemes[newKey] = {
      color: themeColor,
      ...getContrast(themeColor),
    };
  });

  return {
    ...base,
    themes: newThemes,
  };
};

export default createColors;
