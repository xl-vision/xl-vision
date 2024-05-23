import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { HTMLAttributes, forwardRef } from 'react';
import { styled } from '../styles';

export type DropdownDividerProps = HTMLAttributes<HTMLDivElement>;

const displayName = 'DropdownDivider';

const DropdownDividerRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { colors } = theme;
  return {
    width: '100%',
    height: 1,
    backgroundColor: colors.divider.primary,
    margin: '2px 0',
  };
});

const DropdownDivider = forwardRef<HTMLDivElement, DropdownDividerProps>((props, ref) => {
  const { ...others } = props;

  return <DropdownDividerRoot {...others} ref={ref} />;
});

if (!isProduction) {
  DropdownDivider.displayName = displayName;
  DropdownDivider.propTypes = {
    className: PropTypes.string,
  };
}

export default DropdownDivider;
