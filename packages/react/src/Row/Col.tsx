import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { env } from '@xl-vision/utils';
import { CSSObject } from '@xl-vision/styled-engine';
import { styled } from '../styles';
import RowContext from './RowContext';
import { useTheme } from '../ThemeProvider';
import { Breakpoint } from '../ThemeProvider/breakpoints';

export type ColSpanType = number | Partial<Record<Breakpoint, number>>;

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  offset?: ColSpanType;
  order?: ColSpanType;
  pull?: ColSpanType;
  push?: ColSpanType;
  column: ColSpanType;
}

const displayName = 'Col';

const ColRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, breakpoints } = theme;

  const { column, unit, values, points } = breakpoints;

  const rootClassName = `&.${clsPrefix}-col`;

  const cssObject: CSSObject = {};

  for (let i = 0; i <= column; i++) {
    cssObject[`${rootClassName}-column-${i}`] = {
      display: i === 0 ? 'none' : 'block',
      minHeight: 1,
      width: `${(i / column) * 100}%`,
    };
    cssObject[`${rootClassName}-offset-${i}`] = {
      marginLeft: `${(i / column) * 100}%`,
    };
    cssObject[`${rootClassName}-push-${i}`] = {
      left: `${(i / column) * 100}%`,
    };
    cssObject[`${rootClassName}-pull-${i}`] = {
      right: `${(i / column) * 100}%`,
    };
    cssObject[`${rootClassName}-order-${i}`] = {
      order: `${(i / column) * 100}%`,
    };
  }

  points.forEach((point) => {
    const value = values[point as Breakpoint];
    const mediaQuery = `@media (min-width: ${value}${unit})`;

    const mediaObject: CSSObject = {};

    cssObject[mediaQuery] = mediaObject;
    for (let i = 0; i <= column; i++) {
      mediaObject[`${rootClassName}-column-${point}-${i}`] = {
        display: i === 0 ? 'none' : 'block',
        minHeight: 1,
        width: `${(i / column) * 100}%`,
      };
      mediaObject[`${rootClassName}-offset-${point}-${i}`] = {
        marginLeft: `${(i / column) * 100}%`,
      };
      mediaObject[`${rootClassName}-push-${point}-${i}`] = {
        left: `${(i / column) * 100}%`,
      };
      mediaObject[`${rootClassName}-pull-${point}-${i}`] = {
        right: `${(i / column) * 100}%`,
      };
      mediaObject[`${rootClassName}-order-${point}-${i}`] = {
        order: `${(i / column) * 100}%`,
      };
    }
  });

  return {
    boxSizing: 'border-box',
    display: 'block',
    position: 'relative',
    ...cssObject,
  };
});

const Col = React.forwardRef<HTMLDivElement, ColProps>((props, ref) => {
  const { children, className, offset, order, pull, push, column, style, ...others } = props;

  const { gutter, breakPoints, removeOnUnvisible } = React.useContext(RowContext);
  const { clsPrefix } = useTheme();

  if (removeOnUnvisible && breakPoints) {
    if (typeof column === 'object') {
      for (let i = 0; i < breakPoints.length; i++) {
        const [breakPoint, match] = breakPoints[i];
        const col = column[breakPoint];
        if (match && col !== undefined) {
          if (col === 0) {
            return null;
          }
          break;
        }
      }
    } else if (column === 0) {
      return null;
    }
  }

  const rootClassName = `${clsPrefix}-col`;

  const colStyle =
    gutter > 0
      ? {
          ...style,
          paddingLeft: gutter / 2,
          paddingRight: gutter / 2,
        }
      : style;

  const rootClasses = clsx(
    rootClassName,
    [
      getClasses(`${rootClassName}-column`, column),
      getClasses(`${rootClassName}-offset`, offset),
      getClasses(`${rootClassName}-order`, order),
      getClasses(`${rootClassName}-pull`, pull),
      getClasses(`${rootClassName}-push`, push),
    ],
    className,
  );

  return (
    <ColRoot {...others} style={colStyle} className={rootClasses} ref={ref}>
      {children}
    </ColRoot>
  );
});

if (!env.isProduction) {
  Col.displayName = displayName;

  Col.propTypes = {
    column: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired])
      .isRequired,
    offset: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    push: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    pull: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    order: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    className: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.object,
  };
}

export default Col;

const getClasses = (baseClassName: string, value?: ColSpanType): string => {
  if (typeof value === 'number') {
    return `${baseClassName}-${value}`;
  }
  if (typeof value === 'object') {
    const classes: Array<string> = [];
    Object.keys(value).forEach((key) => {
      classes.push(`${baseClassName}-${key}-${value[key as Breakpoint]}`);
    });
    return classes.join(' ');
  }
  return '';
};
