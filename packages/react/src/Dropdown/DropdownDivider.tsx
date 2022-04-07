import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { isProduction } from '@xl-vision/utils';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type DropdownDividerProps = React.HTMLAttributes<HTMLDivElement>;

const displayName = 'DropdownDivider';

const DropdownDividerRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { color } = theme;
  return {
    width: '100%',
    height: 1,
    backgroundColor: color.divider,
  };
});

const DropdownDivider = React.forwardRef<HTMLDivElement, DropdownDividerProps>((props, ref) => {
  const { className, ...others } = props;

  const { clsPrefix } = useTheme();

  const rootClassName = `${clsPrefix}-dropdown-divider`;

  const rootClasses = clsx(rootClassName, className);

  return <DropdownDividerRoot {...others} ref={ref} className={rootClasses} />;
});

if (!isProduction) {
  DropdownDivider.displayName = displayName;
  DropdownDivider.propTypes = {
    className: PropTypes.string,
  };
}

export default DropdownDivider;
