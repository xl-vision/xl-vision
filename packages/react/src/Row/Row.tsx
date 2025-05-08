import { CSSObject } from '@xl-vision/styled-engine';
import { isObject, isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import {
  HTMLAttributes,
  ComponentType,
  forwardRef,
  useMemo,
  ReactNode,
  JSX,
  useRef,
  useImperativeHandle,
} from 'react';
import RowContext from './RowContext';
import useBreakPoints from './useBreakPoints';
import memoStyled from '../memoStyled';
import { Breakpoint } from '../ThemeProvider';
import { RefInstance } from '../types';

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

export type RowInstance = RefInstance<unknown>;

const displayName = 'Row';

const justifyMap: Record<RowJustify, CSSObject['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-around': 'space-around',
  'space-between': 'space-between',
};

const alignMap: Record<RowAlign, CSSObject['alignItems']> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
};

const RowRoot = memoStyled('div', {
  name: displayName,
  slot: 'Root',
})<{ justify?: RowJustify; align?: RowAlign; wrap: boolean }>(() => {
  return {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    variants: [
      {
        props: {
          wrap: true,
        },
        style: {
          flexWrap: 'wrap',
        },
      },
      ...Object.keys(justifyMap).map((k) => {
        const justify = k as RowJustify;

        return {
          props: {
            justify,
          },
          style: {
            justifyContent: justifyMap[justify],
          },
        };
      }),
      ...Object.keys(alignMap).map((k) => {
        const align = k as RowAlign;

        return {
          props: {
            align,
          },
          style: {
            alignItems: alignMap[align],
          },
        };
      }),
    ],
  };
});

const Row = forwardRef<RowInstance, RowProps>((props, ref) => {
  const {
    align,
    justify,
    children,
    gutter,
    style,
    wrap,
    removeOnUnvisible,
    component = 'div',
    ...others
  } = props;

  const breakPoints = useBreakPoints();

  const computedGutter = useMemo(() => {
    if (typeof gutter === 'number') {
      return gutter;
    }
    if (isObject(gutter)) {
      for (let i = 0; i < breakPoints.length; i++) {
        const [breakPoint, match] = breakPoints[i];
        if (match && gutter[breakPoint] !== undefined) {
          return gutter[breakPoint];
        }
      }
    }
    return 0;
  }, [breakPoints, gutter]);

  const rootRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

  const rowStyle =
    computedGutter > 0
      ? {
          marginLeft: computedGutter / -2,
          marginRight: computedGutter / -2,
          ...style,
        }
      : style;

  const memorizedValue = useMemo(
    () => ({ gutter: computedGutter, breakPoints, removeOnUnvisible }),
    [computedGutter, breakPoints, removeOnUnvisible],
  );

  return (
    <RowContext.Provider value={memorizedValue}>
      <RowRoot
        {...others}
        as={component}
        ref={rootRef}
        style={rowStyle}
        styleProps={{ justify, align, wrap: !!wrap }}
      >
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
    component: PropTypes.oneOf([PropTypes.elementType.isRequired, PropTypes.string]),
    gutter: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.object.isRequired]),
    justify: PropTypes.oneOf(['start', 'end', 'center', 'space-around', 'space-between']),
    removeOnUnvisible: PropTypes.bool,
    style: PropTypes.shape({}),
    wrap: PropTypes.bool,
  };
}

export default Row;
