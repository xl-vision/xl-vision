import { isObject, isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { HTMLAttributes, ComponentType, forwardRef, useMemo, ReactNode } from 'react';
import RowContext from './RowContext';
import useBreakPoints from './useBreakPoints';
import { styled } from '../styles';
import { Breakpoint, useTheme } from '../ThemeProvider';

export type RowAlign = 'top' | 'middle' | 'bottom';
export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: RowAlign;
  className?: string;
  component?: keyof JSX.IntrinsicElements | ComponentType;
  gutter?: number | Partial<Record<Breakpoint, number>>;
  justify?: RowJustify;
  removeOnUnvisible?: boolean;
  wrap?: boolean;
}

const displayName = 'Row';

const RowRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme: { clsPrefix } }) => {
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

const Row = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  const {
    align,
    justify,
    children,
    gutter,
    style,
    className,
    wrap,
    removeOnUnvisible,
    component = 'div',
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const breakPoints = useBreakPoints();

  const computedGutter = useMemo(() => {
    if (typeof gutter === 'number') {
      return gutter;
    }
    if (isObject(gutter)) {
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
    {
      [`${rootClassName}--justify-${justify}`]: justify,
      [`${rootClassName}--align-${align}`]: align,
      [`${rootClassName}--wrap`]: wrap,
    },
    className,
  );

  const memorizedValue = useMemo(
    () => ({ gutter: computedGutter, breakPoints, removeOnUnvisible }),
    [computedGutter, breakPoints, removeOnUnvisible],
  );

  return (
    <RowContext.Provider value={memorizedValue}>
      <RowRoot {...others} as={component} className={rootClasses} ref={ref} style={rowStyle}>
        {children}
      </RowRoot>
    </RowContext.Provider>
  );
});

if (!isProduction) {
  Row.displayName = displayName;

  Row.propTypes = {
    children: PropTypes.node.isRequired,
    align: PropTypes.oneOf(['top', 'middle', 'bottom']),
    className: PropTypes.string,
    component: PropTypes.oneOf([PropTypes.elementType.isRequired, PropTypes.string as any]),
    gutter: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
    removeOnUnvisible: PropTypes.bool,
    style: PropTypes.shape({}),
    wrap: PropTypes.bool,
  };
}

export default Row;
