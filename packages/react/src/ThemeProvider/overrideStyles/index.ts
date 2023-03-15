import { CSSObject, Interpolation } from '@xl-vision/styled-engine';
import { BaseButtonStyleProps } from '../../BaseButton';
import { ButtonPrefixStyleProps, ButtonStyleProps, ButtonSuffixStyleProps } from '../../Button';
import { RowProps } from '../../Row';
import { Theme } from '../createTheme';

export type Style<
  S extends object | undefined = undefined,
  P extends object = {},
  ST = S extends undefined ? { theme: Theme } : { styleProps: S; theme: Theme },
> = Interpolation<P & ST>;

export type OverrideStyles = Partial<{
  CssBaseline: Partial<{
    Root: (theme: Theme) => CSSObject;
  }>;
  Row: Partial<{
    Root: Style<{
      align: RowProps['align'];
      justify: RowProps['justify'];
      wrap: RowProps['wrap'];
    }>;
  }>;
  Col: Partial<{
    Root: Style<{
      column?: number;
      offset?: number;
      push?: number;
      pull?: number;
      order?: number;
    }>;
  }>;
  Ripple: Partial<{
    Root: Style;
    Inner: Style;
  }>;
  Icon: Partial<{
    Root: Style;
  }>;
  BaseButton: Partial<{
    Root: Style<BaseButtonStyleProps>;
    Inner: Style;
  }>;
  Button: Partial<{
    Root: Style<ButtonStyleProps>;
    Prefix: Style<ButtonPrefixStyleProps>;
    Suffix: Style<ButtonSuffixStyleProps>;
    Loading: Style;
  }>;
}>;

const createOverrideStyles = (styles: OverrideStyles) => {
  return styles;
};

export default createOverrideStyles;
