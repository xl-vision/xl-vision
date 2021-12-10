import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { env } from '@xl-vision/utils';
import { CSSObject } from '@xl-vision/styled-engine';
import { styled } from '../styles';
import { ColProps } from './Col';
import RowContext from './RowContext';
import useBreakPoints from './useBreakPoints';
import { useTheme } from '../ThemeProvider';

export type RowAlign = 'top' | 'middle' | 'bottom';
export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: RowAlign;
  children: React.ReactElement<ColProps> | Array<React.ReactElement<ColProps>>;
  className?: string;
  gutter?: number | Partial<Record<string, number>>;
  justify?: RowJustify;
  type?: 'flex';
  component?: string;
}

const displayName = 'Row';

const RowRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, mixins, breakpoints } = theme;

  const { column, unit, values, points } = breakpoints;

  const colRootClassName = `.${clsPrefix}-col`;
  const rowRootClassName = `.${clsPrefix}-row`;

  const cssObject: CSSObject = {};

  points.forEach((point) => {
    const value = values[point];
    const mediaQuery = `@media (min-width: ${value}${unit})`;
    const queryObject: CSSObject = {};

    cssObject[mediaQuery] = queryObject;

    for (let i = 0; i <= column; i++) {
      cssObject[`${colRootClassName}-column-${i}`] = {
        display: i === 0 ? 'none' : 'block',
        minHeight: 1,
        width: `${(i / column) * 100}%`,
      };
      queryObject[`${colRootClassName}-column-${point}-${i}`] = {
        display: i === 0 ? 'none' : 'block',
        minHeight: 1,
        width: `${(i / column) * 100}%`,
      };
      queryObject[`${colRootClassName}-offset-${point}-${i}`] = {
        marginLeft: `${(i / column) * 100}%`,
      };
      queryObject[`${colRootClassName}-push-${point}-${i}`] = {
        left: `${(i / column) * 100}%`,
      };
      queryObject[`${colRootClassName}-pull-${point}-${i}`] = {
        right: `${(i / column) * 100}%`,
      };
      queryObject[`${colRootClassName}-order-${point}-${i}`] = {
        order: `${(i / column) * 100}%`,
      };
    }
  });

  return {
    position: 'relative',
    boxSizing: 'border-box',
    ...mixins.clearfix,
    ...cssObject,
    [`&${rowRootClassName}--flex`]: {
      display: 'flex',
      flexDirection: 'row',
      '&::after': {
        display: 'none',
      },
    },
    [`&${rowRootClassName}--justify-start`]: {
      justifyContent: 'flex-start',
    },
    [`&${rowRootClassName}--justify-center`]: {
      justifyContent: 'center',
    },
    [`&${rowRootClassName}--justify-end`]: {
      justifyContent: 'flex-end',
    },
    [`&${rowRootClassName}--justify-space-around`]: {
      justifyContent: 'space-around',
    },
    [`&${rowRootClassName}--justify-space-between`]: {
      justifyContent: 'space-between',
    },
    [`&${rowRootClassName}--align-top`]: {
      alignItems: 'flex-start',
    },
    [`&${rowRootClassName}--align-middle`]: {
      alignItems: 'center',
    },
    [`&${rowRootClassName}--align-botton`]: {
      alignItems: 'flex-end',
    },
  };
});

const Row = React.forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  const {
    align,
    justify,
    children,
    gutter,
    type,
    style,
    className,
    component = 'div',
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const breakPoints = useBreakPoints();

  const computedGutter = React.useMemo(() => {
    if (typeof gutter === 'number') {
      return gutter;
    }
    if (typeof gutter === 'object') {
      for (let i = 0; i < breakPoints.length; i++) {
        const [breakPoint, match] = breakPoints[i];
        if (match && gutter[breakPoint] !== undefined) {
          return gutter[breakPoint] as number;
        }
      }
    }
    return 0;
  }, [breakPoints, gutter]);

  const rowStyle =
    computedGutter > 0
      ? {
          marginLeft: computedGutter / -2,
          marginRight: computedGutter / -2,
          ...style,
        }
      : style;

  const isFlex = type === 'flex';

  const rootClassName = `${clsPrefix}-row`;

  const rootClasses = clsx(
    rootClassName,
    {
      [`${rootClassName}--flex`]: isFlex,
      [`${rootClassName}--justify-${justify}`]: isFlex && justify,
      [`${rootClassName}--align-${align}`]: isFlex && align,
    },
    className,
  );

  const memorizedValue = React.useMemo(() => ({ gutter: computedGutter }), [computedGutter]);

  return (
    <RowContext.Provider value={memorizedValue}>
      <RowRoot {...others} style={rowStyle} className={rootClasses} ref={ref} as={component}>
        {children}
      </RowRoot>
    </RowContext.Provider>
  );
});

if (!env.isProduction) {
  Row.displayName = displayName;

  Row.propTypes = {
    align: PropTypes.oneOf(['top', 'middle', 'bottom']),
    justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
    type: PropTypes.oneOf(['flex']),
    gutter: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    children: PropTypes.oneOfType([
      PropTypes.element.isRequired,
      PropTypes.arrayOf(PropTypes.element.isRequired),
    ]).isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    component: PropTypes.string,
  };
}

export default Row;
