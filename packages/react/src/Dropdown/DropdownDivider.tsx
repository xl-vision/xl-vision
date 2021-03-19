import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '../styles';
import ThemeContext from '../ThemeProvider/ThemeContext';
import { isDevelopment } from '../utils/env';

export interface DropdownDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

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

  const { clsPrefix } = React.useContext(ThemeContext);

  const rootClassName = `${clsPrefix}-dropdown-divider`;

  const rootClasses = clsx(rootClassName, className);

  return <DropdownDividerRoot {...others} ref={ref} className={rootClasses} />;
});

if (isDevelopment) {
  DropdownDivider.displayName = displayName;
  DropdownDivider.propTypes = {
    className: PropTypes.string,
  };
}

export default DropdownDivider;
