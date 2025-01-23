import { CSSObject } from '@xl-vision/styled-engine';
import { isObject, isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react';
import RowContext from './RowContext';
import { styled } from '../styles';
import { useTheme, Breakpoint } from '../ThemeProvider';
import { RefInstance } from '../types';

export type ColSpanType = number | Partial<Record<Breakpoint, number>>;

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  column: ColSpanType;
  children?: ReactNode;
  className?: string;
  offset?: ColSpanType;
  order?: ColSpanType;
  pull?: ColSpanType;
  push?: ColSpanType;
}

export type ColInstance = RefInstance<HTMLDivElement>;

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

const Col = forwardRef<ColInstance, ColProps>((props, ref) => {
  const { children, className, offset, order, pull, push, column, style, ...others } = props;

  const { gutter, breakPoints, removeOnUnvisible } = useContext(RowContext);
  const { clsPrefix } = useTheme();

  const rootRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      get nativeElement() {
        return rootRef.current;
      },
    }),
    [],
  );

  if (removeOnUnvisible && breakPoints) {
    if (isObject(column)) {
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
    <ColRoot {...others} className={rootClasses} ref={rootRef} style={colStyle}>
      {children}
    </ColRoot>
  );
});

if (!isProduction) {
  Col.displayName = displayName;

  Col.propTypes = {
    column: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired])
      .isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    offset: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    order: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    pull: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    push: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),

    style: PropTypes.shape({}),
  };
}

export default Col;

const getClasses = (baseClassName: string, value?: ColSpanType): string => {
  if (typeof value === 'number') {
    return `${baseClassName}-${value}`;
  }
  if (isObject(value)) {
    const classes: Array<string> = [];
    Object.keys(value).forEach((key) => {
      classes.push(`${baseClassName}-${key}-${value[key as Breakpoint]}`);
    });
    return classes.join(' ');
  }
  return '';
};
