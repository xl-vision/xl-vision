import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { env } from '@xl-vision/utils';
import { styled } from '../styles';
import RowContext from './RowContext';
import { useTheme } from '../ThemeProvider';

export type ColSpanType = number | Partial<Record<string, number>>;

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
})(() => {
  return {
    float: 'left',
    boxSizing: 'border-box',
    display: 'block',
    position: 'relative',
  };
});

const Col = React.forwardRef<HTMLDivElement, ColProps>((props, ref) => {
  const { children, className, offset, order, pull, push, column, style, ...others } = props;

  const { gutter } = React.useContext(RowContext);
  const { clsPrefix } = useTheme();

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
      classes.push(`${baseClassName}-${key}-${value[key]}`);
    });
    return classes.join(' ');
  }
  return '';
};
