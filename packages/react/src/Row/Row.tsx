import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { env } from '@xl-vision/utils';
import { styled } from '../styles';
import { ColProps } from './Col';
import RowContext from './RowContext';
import useBreakPoints from './useBreakPoints';
import { useTheme } from '../ThemeProvider';
import { Breakpoint } from '../ThemeProvider/breakpoints';

export type RowAlign = 'top' | 'middle' | 'bottom';
export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: RowAlign;
  children: React.ReactElement<ColProps> | Array<React.ReactElement<ColProps>>;
  className?: string;
  gutter?: number | Partial<Record<Breakpoint, number>>;
  justify?: RowJustify;
  component?: keyof JSX.IntrinsicElements | React.ComponentType;
  wrap?: boolean;
}

const displayName = 'Row';

const RowRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix } = theme;

  const rootClassName = `&.${clsPrefix}-row`;

  return {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    [`${rootClassName}--justify-start`]: {
      justifyContent: 'flex-start',
    },
    [`${rootClassName}--justify-center`]: {
      justifyContent: 'center',
    },
    [`${rootClassName}--justify-end`]: {
      justifyContent: 'flex-end',
    },
    [`${rootClassName}--justify-space-around`]: {
      justifyContent: 'space-around',
    },
    [`${rootClassName}--justify-space-between`]: {
      justifyContent: 'space-between',
    },
    [`${rootClassName}--align-top`]: {
      alignItems: 'flex-start',
    },
    [`${rootClassName}--align-middle`]: {
      alignItems: 'center',
    },
    [`${rootClassName}--align-bottom`]: {
      alignItems: 'flex-end',
    },
    [`${rootClassName}--wrap`]: {
      flexWrap: 'wrap',
    },
  };
});

const Row = React.forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  const {
    align,
    justify,
    children,
    gutter,
    style,
    className,
    wrap,
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

  const rootClassName = `${clsPrefix}-row`;

  const rootClasses = clsx(
    rootClassName,
    {
      [`${rootClassName}--justify-${justify}`]: justify,
      [`${rootClassName}--align-${align}`]: align,
      [`${rootClassName}--wrap`]: wrap,
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
    gutter: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    wrap: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.element.isRequired,
      PropTypes.arrayOf(PropTypes.element.isRequired),
    ]).isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    component: PropTypes.any,
  };
}

export default Row;
