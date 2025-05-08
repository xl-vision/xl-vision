import { useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useContext,
  MouseEvent,
  useRef,
  useImperativeHandle,
} from 'react';
import DropdownContext from './DropdownContext';
import BaseButton from '../BaseButton';
import memoStyled from '../memoStyled';
import { RefInstance } from '../types';

export interface DropdownItemProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
  disabled?: boolean;
}

export type DropdownItemInstance = RefInstance<HTMLLIElement>;

const displayName = 'DropdownItem';

const DropdownItemRoot = memoStyled('li', {
  name: displayName,
  slot: 'Root',
})<{ disabled?: boolean }>(() => {
  return {
    display: 'block',
    padding: 0,
    margin: 0,
  };
});

export type DropdownItemButtonStyleProps = {
  disabled?: boolean;
};

const DropdownItemButton = memoStyled(BaseButton, {
  name: displayName,
  slot: 'Button',
})<DropdownItemButtonStyleProps>(({ theme }) => {
  const { colors, transitions, typography } = theme;

  return {
    padding: '5px 12px',
    transition: transitions.standard('all'),
    color: colors.text.primary,
    // 不设置会导致有间隙，原因未知
    width: '100%',
    textAlign: 'left',
    ...typography.body2.style,
    '&:hover': {
      backgroundColor: colors.background.hover,
    },
    variants: [
      {
        props: {
          disabled: true,
        },
        style: {
          opacity: colors.opacity.disabled,
          cursor: 'not-allowed',
          '&:hover': {
            backgroundColor: 'inherit',
          },
        },
      },
    ],
  };
});

const DropdownItem = forwardRef<DropdownItemInstance, DropdownItemProps>((props, ref) => {
  const { children, onClick, disabled, ...others } = props;

  const { setOpen } = useContext(DropdownContext);

  const rootRef = useRef<HTMLLIElement>(null);

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

  const handleClick = useConstantFn((e: MouseEvent<HTMLLIElement>) => {
    if (disabled) {
      return;
    }
    setOpen(false);
    onClick?.(e);
  });

  return (
    <DropdownItemRoot {...others} ref={rootRef} styleProps={{ disabled }} onClick={handleClick}>
      <DropdownItemButton
        // cant use prop disabled
        // see https://github.com/facebook/react/issues/10109
        // disabled={disabled}
        aria-disabled={disabled}
        disableRipple={disabled}
        styleProps={{ disabled }}
      >
        {children}
      </DropdownItemButton>
    </DropdownItemRoot>
  );
});

if (!isProduction) {
  DropdownItem.displayName = displayName;
  DropdownItem.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  };
}

export default DropdownItem;
