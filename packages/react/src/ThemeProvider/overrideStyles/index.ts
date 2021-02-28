import { CSSObject, FunctionInterpolation } from '@xl-vision/styled-engine-types';
import { BaseButtonStyleProps } from '../../BaseButton';
import { RowProps } from '../../Row';
import { Theme } from '../createTheme';

export type Style<
  S extends {} | undefined = undefined,
  P extends {} = {},
  ST = S extends undefined ? { theme: Theme } : { styleProps: S; theme: Theme }
> = TemplateStringsArray | CSSObject | FunctionInterpolation<P & ST>;

export type OverrideStyles = Partial<{
  Row: {
    Root: Style<{
      align: RowProps['align'];
      justify: RowProps['justify'];
      type: RowProps['type'];
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
}>;

const createOverrideStyles = (styles: OverrideStyles) => {
  return styles;
};

export default createOverrideStyles;
