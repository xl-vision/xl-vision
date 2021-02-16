import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { styled, ThemeContext } from '../styles';
import { ColProps } from './Col';
import RowContext from './RowContext';
import useMedia from './useMedia';

export type RowAlign = 'top' | 'middle' | 'bottom';
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
}>(({ theme, styleProps }) => {
  const { align, justify, type } = styleProps;
  const { mixins } = theme;

  const alignItems =
    align === 'top'
      ? 'flex-start'
      : align === 'middle'
      ? 'center'
      : align === 'bottom'
      ? 'flex-end'
      : undefined;

  const justifyContent =
    justify === 'start' ? 'flex-start' : justify === 'end' ? 'flex-end' : justify;

  return {
    position: 'relative',
    boxSizing: 'border-box',
    ...mixins.clearfix,
    ...(type === 'flex' && {
      display: 'flex',
      flexDirection: 'row',
      justifyContent,
      alignItems,
      '&::after': {
        display: 'none',
      },
    }),
  };
});

const Row: React.FunctionComponent<RowProps> = (props) => {
  const { align, justify, children, gutter, type, style, className, ...others } = props;

  const { breakpoints, clsPrefix } = React.useContext(ThemeContext);

  const matches = useMedia(breakpoints.values, breakpoints.unit);

  const computedGutter = React.useMemo(() => {
    if (typeof gutter === 'number') {
      return gutter;
    }
    if (typeof gutter === 'object') {
      for (let i = 0; i < matches.length; i++) {
        const breakPoint = matches[i];
        if (gutter[breakPoint] !== undefined) {
          return gutter[breakPoint] as number;
        }
      }
    }
    return 0;
  }, [matches, gutter]);

  const rowStyle =
    computedGutter > 0
      ? {
          marginLeft: computedGutter / -2,
          marginRight: computedGutter / -2,
          ...style,
        }
      : style;

  const isFlex = type === 'flex';

  const rootClassName = `${clsPrefix}-row-root`;

  const classes = clsx(
    rootClassName,
    isFlex && `${rootClassName}-flex`,
    isFlex && justify && `${rootClassName}-justify-${justify}`,
    isFlex && align && `${rootClassName}-align-${align}`,
    className,
  );

  return (
    <RowContext.Provider value={{ matches, gutter: computedGutter }}>
      <RowRoot
        {...others}
        style={rowStyle}
        className={classes}
        styleProps={{
          align,
          justify,
          type,
        }}
      >
        {children}
      </RowRoot>
    </RowContext.Provider>
  );
};

Row.propTypes = {
  align: PropTypes.oneOf(['top', 'middle', 'bottom']),
  justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
  type: PropTypes.oneOf(['flex']),
  gutter: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element.isRequired),
  ]).isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Row;
