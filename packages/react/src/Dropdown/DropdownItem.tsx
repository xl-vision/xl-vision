import { useConstantFn } from '@xl-vision/hooks';
import { CSSObject } from '@xl-vision/styled-engine';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
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
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import { RefInstance } from '../types';

export interface DropdownItemProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
  disabled?: boolean;
}

export type DropdownItemInstance = RefInstance<HTMLLIElement>;

const displayName = 'DropdownItem';

const DropdownItemRoot = styled('li', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {
    display: 'block',
    padding: 0,
    margin: 0,
  };
});

export type DropdownItemButtonStyleProps = {
  disabled?: boolean;
};

const DropdownItemButton = styled(BaseButton, {
  name: displayName,
  slot: 'Button',
})<DropdownItemButtonStyleProps>(({ theme, styleProps }) => {
  const { colors, transitions, typography } = theme;

  const { disabled } = styleProps;

  const styles: CSSObject = {
    padding: '5px 12px',
    transition: transitions.standard('all'),
    color: colors.text.primary,
    // 不设置会导致有间隙，原因未知
    width: '100%',
    textAlign: 'left',
    ...typography.body2.style,
  };

  if (disabled) {
    styles.opacity = colors.opacity.disabled;
  } else {
    styles['&:hover'] = {
      backgroundColor: colors.background.hover,
      // color: colors.themes.primary.text.primary,
    };
  }

  return styles;
});

const DropdownItem = forwardRef<DropdownItemInstance, DropdownItemProps>((props, ref) => {
  const { children, onClick, disabled, className, ...others } = props;

  const { clsPrefix } = useTheme();

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

  const rootClassName = `${clsPrefix}-dropdown-item`;

  const rootClasses = clsx(
    {
      [`${rootClassName}--disabled`]: disabled,
    },
    className,
  );

  return (
    <DropdownItemRoot {...others} className={rootClasses} ref={rootRef} onClick={handleClick}>
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
