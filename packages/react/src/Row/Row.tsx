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
})<{ align: RowProps['align']; justify: RowProps['justify']; media?: string }>(
  ({ theme, styleProps }) => {
    const { align, justify, media } = styleProps;
    const { mixins } = theme;
    return {
      position: 'relative',
      boxSizing: 'border-box',
      ...mixins.clearfix,
    };
  },
);

const Row: React.FunctionComponent<RowProps> = (props) => {
  const { align = 'center', justify, children, ...others } = props;

  const { breakpoints } = React.useContext(ThemeContext);

  const media = useMedia(breakpoints.values, breakpoints.unit);

  return (
    <RowRoot
      {...others}
      styleProps={{
        align,
        justify,
        media,
      }}
    >
      {children}
    </RowRoot>
  );
};

export default Row;
