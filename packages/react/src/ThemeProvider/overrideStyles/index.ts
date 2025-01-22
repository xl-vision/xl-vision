import { CSSObject, Interpolation } from '@xl-vision/styled-engine';
import { BaseButtonStyleProps } from '../../BaseButton';
import { ButtonPrefixStyleProps, ButtonStyleProps, ButtonSuffixStyleProps } from '../../Button';
import { RowProps } from '../../Row';
import { Theme } from '../createTheme';

export type Style<
  S extends object | void = void,
  P extends object = object,
  ST = S extends void ? { theme: Theme } : { styleProps: S; theme: Theme },
> = Interpolation<P & ST>;

export type PartialOverrideStyles<T extends Record<string, unknown>> = Partial<{
  [K in keyof T]: Partial<T[K]>;
}>;

export type OverrideStyles = PartialOverrideStyles<{
  CssBaseline: {
    Root: (theme: Theme) => CSSObject;
  };
  Row: {
    Root: Style<{
      align: RowProps['align'];
      justify: RowProps['justify'];
      wrap: RowProps['wrap'];
    }>;
  };
  Col: {
    Root: Style<{
      column?: number;
      offset?: number;
      push?: number;
      pull?: number;
      order?: number;
    }>;
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
