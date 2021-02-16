import React from 'react';
import { styled, ThemeContext } from '../styles';
import { ColProps } from './Col';
import useMedia from './useMedia';

export type RowAlign = 'top' | 'center' | 'bottom';
export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: RowAlign;
  children: React.ReactElement<ColProps> | Array<React.ReactElement<ColProps>>;
  className?: string;
  gutter?: number | Partial<Record<string, number>>;
  justify?: RowJustify;
  type?: 'flex';
}

const RowRoot = styled('div', {
  name: 'Row',
  slot: 'Root',
})<{
  align: RowProps['align'];
  justify: RowProps['justify'];
  type: RowProps['type'];
  totalColumns: number;
}>(({ theme, styleProps }) => {
  const { align, justify, type } = styleProps;
  const { mixins } = theme;

  const base =
    type === 'flex'
      ? {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: justify,
          alignItems: align,
          '&::after': {
            display: 'none',
          },
        }
      : {
          position: 'relative',
          boxSizing: 'border-box',
          ...mixins.clearfix,
        };
  return {
    ...base,
  };
});

const Row: React.FunctionComponent<RowProps> = (props) => {
  const { align, justify, children, gutter, type, style, ...others } = props;

  const { breakpoints } = React.useContext(ThemeContext);

  const matched = useMedia(breakpoints.values, breakpoints.unit);

  const computedGutter = React.useMemo(() => {
    if (typeof gutter === 'number') {
      return gutter;
    }
    if (typeof gutter === 'object') {
      for (let i = 0; i < matched.length; i++) {
        const breakPoint = matched[i];
        if (gutter[breakPoint] !== undefined) {
          return gutter[breakPoint] as number;
        }
      }
    }
    return 0;
  }, [matched, gutter]);

  const rowStyle =
    computedGutter > 0
      ? {
          marginLeft: computedGutter / -2,
          marginRight: computedGutter / -2,
          ...style,
        }
      : style;

  return (
    <RowRoot
      {...others}
      style={rowStyle}
      styleProps={{
        align,
        justify,
        totalColumns: breakpoints.columns,
        type,
      }}
    >
      {children}
    </RowRoot>
  );
};

export default Row;
