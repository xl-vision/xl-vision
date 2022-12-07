import { useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentType,
  EventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  SyntheticEvent,
  useEffect,
  useRef,
} from 'react';
import Ripple, { RippleRef } from '../Ripple';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';

export type BaseButtonCommonProps =
  | ButtonHTMLAttributes<HTMLButtonElement>
  | AnchorHTMLAttributes<HTMLAnchorElement>;

export type BaseButtonProps = BaseButtonCommonProps & {
  disabled?: boolean;
  loading?: boolean;
  disableRipple?: boolean;
};

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
  const { clsPrefix, color } = theme;
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
      opacity: color.action.pressed,
      '&-enter-active': {
        transition: theme.transition.enter('all'),
      },
      '&-exit-active': {
        transition: theme.transition.exitPermanent('all'),
      },
      '&-enter-from': {
        transform: 'scale(0)',
        opacity: 0.1,
      },
      '&-exit-to': {
        opacity: 0,
      },
    },
  };
  // fix type warning
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

const BaseButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, BaseButtonProps>(
  (props, ref) => {
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
      ...others
    } = props;

    const { clsPrefix } = useTheme();

    const Component = (others as unknown as HTMLAnchorElement).href ? 'a' : 'button';

    const rippleRef = useRef<RippleRef>(null);
    const isKeyDownRef = useRef(false);

    // 按钮切换到loading或者disabled时，强制触发stop
    useEffect(() => {
      if (loading || disabled) {
        if (rippleRef.current) {
          rippleRef.current.stop();
        }
      }
    }, [loading, disabled]);

    const shouldEnableRipple = !disableRipple && !disabled && !loading;

    const useRippleHandler = <E extends SyntheticEvent, H extends EventHandler<E>>(
      action: keyof RippleRef,
      defaultEventHandler?: H,
      disableRippleAction = !shouldEnableRipple,
    ) => {
      return useConstantFn((e: E) => {
        defaultEventHandler?.(e);

        if (!disableRippleAction && rippleRef.current) {
          rippleRef.current[action](e);
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

    const handleKeyDown: KeyboardEventHandler<any> = useConstantFn((e) => {
      if (rippleRef.current && !isKeyDownRef.current && e.key === ' ') {
        isKeyDownRef.current = true;
        rippleRef.current.start();
      }

      onKeyDown?.(e);
    });
    const handleKeyUp: KeyboardEventHandler<any> = useConstantFn((e) => {
      if (rippleRef.current && isKeyDownRef.current && e.key === ' ') {
        isKeyDownRef.current = false;
        rippleRef.current.stop();
      }
      onKeyUp?.(e);
    });

    const handleClick: MouseEventHandler<any> = useConstantFn((e) => {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    });

    const rootClassName = `${clsPrefix}-base-button`;

    const rootClasses = clsx(
      rootClassName,
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
        ref={ref}
        styleProps={{ loading, disabled }}
        // 非激活状态不允许选中
        tabIndex={loading || disabled ? -1 : tabIndex}
        onBlur={handleBlur}
        onClick={handleClick}
        onDragLeave={handleDragLeave}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
      >
        <BaseButtonInner className={`${rootClassName}__inner`}>{children}</BaseButtonInner>
        <Ripple
          className={`${rootClassName}__ripple`}
          exitAfterEnter={true}
          ref={rippleRef}
          transitionClassName={`${rootClassName}__ripple`}
        />
      </BaseButtonRoot>
    );
  },
);

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
