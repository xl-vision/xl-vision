import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, ThemeContext } from '../styles';
import BaseIcon, { BaseIconProps } from './BaseIcon';

export interface IconProps extends BaseIconProps {}

const SvgIcon = styled(BaseIcon, {
  name: 'Icon',
  slot: 'Root',
})(({ theme }) => {
  const { transition } = theme;
  return {
    userSelect: 'none',
    width: '1em',
    height: '1em',
    display: 'inline-block',
    fill: 'currentcolor',
    flexShrink: 0,
    transition: transition.standard('fill', transition.durations.standard),
  };
});

const Icon: React.FunctionComponent<IconProps> = React.forwardRef((props, ref) => {
  const { viewBox = '0 0 24 24', className, ...others } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const rootClassName = `${clsPrefix}-icon-root`;

  const classes = clsx(rootClassName, className);

  return <SvgIcon {...others} className={classes} viewBox={viewBox} ref={ref} />;
});

Icon.propTypes = {
  viewBox: PropTypes.string,
  className: PropTypes.string,
};

Icon.displayName = 'Icon';

export default Icon;
