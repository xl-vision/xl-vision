import { useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentType,
  EventHandler,
  FocusEvent,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  SyntheticEvent,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import Ripple, { RippleInstance } from '../Ripple';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import { RefInstance } from '../types';

export type BaseButtonCommonProps =
  | ButtonHTMLAttributes<HTMLButtonElement>
  | AnchorHTMLAttributes<HTMLAnchorElement>;

export type BaseButtonProps = BaseButtonCommonProps & {
  disabled?: boolean;
  loading?: boolean;
  disableRipple?: boolean;
};

export type BaseButtonInstance = RefInstance<HTMLButtonElement | HTMLAnchorElement>;

const displayName = 'BaseButton';

export type BaseButtonStyleProps = {
  loading?: boolean;
  disabled?: boolean;
};

const BaseButtonRoot = styled('button', {
  name: displayName,
  slot: 'Root',
})<BaseButtonStyleProps>(({ styleProps, theme }) => {
  const { disabled, loading } = styleProps;
  const { colors, clsPrefix } = theme;

  return {
    position: 'relative',
    display: 'inline-block',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    textDecoration: 'none',
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: 0,
    outline: 0,
    userSelect: 'none',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
    '&::-moz-focus-inner': {
      borderStyle: 'none', // Remove Firefox dotted outline.
    },

    // https://github.com/facebook/react/issues/4492#issuecomment-426356566
    svg: {
      pointerEvents: 'none',
    },

    [`.${clsPrefix}-base-button__ripple`]: {
      transform: 'scale(1)',
      opacity: colors.opacity.ripple,
      '&-enter-active': {
        transition: theme.transitions.enter('all'),
      },
      '&-exit-active': {
        transition: theme.transitions.exit('all'),
      },
      '&-enter-from': {
        transform: 'scale(0)',
        opacity: 0,
      },
      '&-exit-to': {
        opacity: 0,
      },
    },
  };
  // fix type warning
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as unknown as ComponentType<any>;

const BaseButtonInner = styled('span', {
  name: displayName,
  slot: 'Inner',
})(() => {
  return {
    // 阻止ie下 focus时文字移动
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    height: '100%',
  };
});

const BaseButton = forwardRef<BaseButtonInstance, BaseButtonProps>((props, ref) => {
  const {
    children,
    disabled,
    loading,
    disableRipple,
    className,
    tabIndex,
    onClick,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    onDragLeave,
    onBlur,
    onKeyDown,
    onKeyUp,
    onFocus,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const Component = (others as unknown as HTMLAnchorElement).href ? 'a' : 'button';

  const rippleRef = useRef<RippleInstance>(null);
  const isKeyDownRef = useRef(false);

  const rootRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        // 强制转成一种类型，避免类型错误
        return rootRef.current as HTMLButtonElement;
      },
    };
  }, []);

  // 按钮切换到loading或者disabled时，强制触发stop
  useEffect(() => {
    if ((loading || disabled) && rippleRef.current) {
      rippleRef.current.stop();
    }
  }, [loading, disabled]);

  const shouldEnableRipple = !disableRipple && !disabled && !loading;

  const isRippleRef = useRef(false);

  const useRippleHandler = <E extends SyntheticEvent, H extends EventHandler<E>>(
    action: 'start' | 'stop',
    defaultEventHandler?: H,
    disableRippleAction = !shouldEnableRipple,
  ) => {
    return useConstantFn((e: E) => {
      defaultEventHandler?.(e);

      const ripple = rippleRef.current;

      if (!disableRippleAction && ripple) {
        ripple[action](e);
        isRippleRef.current = action === 'start';
      }
    });
  };

  const handleMouseDown = useRippleHandler('start', onMouseDown);
  const handleMouseUp = useRippleHandler('stop', onMouseUp);
  const handleMouseLeave = useRippleHandler('stop', onMouseLeave);
  const handleDragLeave = useRippleHandler('stop', onDragLeave);
  const handleTouchStart = useRippleHandler('start', onTouchStart);
  const handleTouchEnd = useRippleHandler('stop', onTouchEnd);
  const handleTouchMove = useRippleHandler('stop', onTouchMove);
  const handleBlur = useRippleHandler('stop', onBlur, false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFocus = useConstantFn((e: FocusEvent<any>) => {
    onFocus?.(e);
    setTimeout(() => {
      if (shouldEnableRipple && rippleRef.current && !isRippleRef.current) {
        rippleRef.current.start({ pulsate: true });
      }
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyDown: KeyboardEventHandler<any> = useConstantFn((e) => {
    if (rippleRef.current && !isKeyDownRef.current && e.key === ' ') {
      isKeyDownRef.current = true;
      rippleRef.current.start();
    }

    onKeyDown?.(e);
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyUp: KeyboardEventHandler<any> = useConstantFn((e) => {
    if (rippleRef.current && isKeyDownRef.current && e.key === ' ') {
      isKeyDownRef.current = false;
      rippleRef.current.stop();
    }
    onKeyUp?.(e);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick: MouseEventHandler<any> = useConstantFn((e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  });

  const rootClassName = `${clsPrefix}-base-button`;

  const rootClasses = clsx(
    {
      [`${rootClassName}--loading`]: loading,
      [`${rootClassName}--disabled`]: disabled,
    },
    className,
  );

  return (
    <BaseButtonRoot
      {...others}
      as={Component}
      className={rootClasses}
      disabled={disabled}
      ref={rootRef}
      styleProps={{ loading, disabled }}
      // 非激活状态不允许选中
      tabIndex={loading || disabled ? -1 : tabIndex}
      onBlur={handleBlur}
      onClick={handleClick}
      onDragLeave={handleDragLeave}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
    >
      <BaseButtonInner>{children}</BaseButtonInner>
      <Ripple
        className={`${rootClassName}__ripple`}
        exitAfterEnter={true}
        ref={rippleRef}
        transitionClassName={`${rootClassName}__ripple`}
      />
    </BaseButtonRoot>
  );
});

if (!isProduction) {
  BaseButton.displayName = displayName;

  BaseButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    disableRipple: PropTypes.bool,
    href: PropTypes.string,
    loading: PropTypes.bool,
    tabIndex: PropTypes.number,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onDragLeave: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseUp: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchMove: PropTypes.func,
    onTouchStart: PropTypes.func,
  };
}

export default BaseButton;
