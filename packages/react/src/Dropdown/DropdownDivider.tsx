import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import { HTMLAttributes, forwardRef, useImperativeHandle, useRef } from 'react';
import { styled } from '../styles';
import { RefInstance } from '../types';

export type DropdownDividerProps = HTMLAttributes<HTMLDivElement>;

export type DropdownDividerInstance = RefInstance<HTMLDivElement>;

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

const DropdownDivider = forwardRef<DropdownDividerInstance, DropdownDividerProps>((props, ref) => {
  const { ...others } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

  return <DropdownDividerRoot {...others} ref={rootRef} />;
});

if (!isProduction) {
  DropdownDivider.displayName = displayName;
  DropdownDivider.propTypes = {
    className: PropTypes.string,
  };
}

export default DropdownDivider;
