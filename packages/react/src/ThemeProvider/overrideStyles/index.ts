import { CSSObject, Interpolation } from '@xl-vision/styled-engine';
import { BaseButtonStyleProps } from '../../BaseButton';
import { ButtonPrefixStyleProps, ButtonStyleProps, ButtonSuffixStyleProps } from '../../Button';
import { Theme } from '../createTheme';

export type Style<
  S extends object | void = void,
  ST = S extends void ? { theme: Theme } : { styleProps: S; theme: Theme },
> = Interpolation<object & ST>;

export type PartialOverrideStyles<T extends Record<string, unknown>> = Partial<{
  [K in keyof T]: Partial<T[K]>;
}>;

export type OverrideStyles = PartialOverrideStyles<{
  CssBaseline: {
    Root: (theme: Theme) => CSSObject;
  };
  Row: {
    Root: Style;
  };
  Col: {
    Root: Style;
  };
  Ripple: {
    Root: Style;
    Inner: Style;
  };
  Icon: {
    Root: Style;
  };
  BaseButton: {
    Root: Style<BaseButtonStyleProps>;
    Inner: Style;
  };
  Button: {
    Root: Style<ButtonStyleProps>;
    Prefix: Style<ButtonPrefixStyleProps>;
    Suffix: Style<ButtonSuffixStyleProps>;
    Loading: Style;
  };
}>;

const createOverrideStyles = (styles?: OverrideStyles) => {
  return styles || {};
};

export default createOverrideStyles;
