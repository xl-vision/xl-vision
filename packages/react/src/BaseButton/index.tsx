import PropTypes from 'prop-types';
import React from 'react';
import useEventCallback from '../hooks/useEventCallback';
import Ripple, { RippleRef } from '../Ripple';
import { styled } from '../styles';
import { isDevelopment } from '../utils/env';

export type BaseButtonCommonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface BaseButtonProps extends BaseButtonCommonProps {
  disabled?: boolean;
  loading?: boolean;
  disableRipple?: boolean;
}

const displayName = 'BaseButton';

const BaseButtonRoot = styled('button', {
  name: displayName,
  slot: 'Root',
})(() => {
  return {};
});

const BaseButton = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, BaseButtonProps>(
  (props, ref) => {
    const {
      children,
      href,
      disabled,
      loading,
      disableRipple,
      /* eslint-disable react/prop-types */
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
      /* eslint-enable react/prop-types */
      ...others
    } = props;

    const Component = href ? 'a' : 'button';

    const rippleRef = React.useRef<RippleRef>(null);
    const isKeyDownRef = React.useRef(false);

    // 按钮切换到loading或者disabled时，强制触发stop
    React.useEffect(() => {
      if (loading || disabled) {
        if (rippleRef.current) {
          rippleRef.current.stop();
        }
      }
    }, [loading, disabled]);

    const shouldEnableRipple = !disableRipple && !disabled && !loading;

    const useRippleHandler = <E extends React.SyntheticEvent, H extends React.EventHandler<E>>(
      action: keyof RippleRef,
      defaultEventHandler?: H,
      disableRippleAction = !shouldEnableRipple,
    ) => {
      return useEventCallback((e: E) => {
        if (defaultEventHandler) {
          defaultEventHandler(e);
        }

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

    const handleKeyDown = useEventCallback(
      (e: React.KeyboardEvent<HTMLButtonElement & HTMLLinkElement>) => {
        if (rippleRef.current && !isKeyDownRef.current && e.key === ' ') {
          isKeyDownRef.current = true;
          rippleRef.current.start();
        }

        onKeyDown?.(e);
      },
    );
    const handleKeyUp = useEventCallback(
      (e: React.KeyboardEvent<HTMLButtonElement & HTMLLinkElement>) => {
        if (rippleRef.current && isKeyDownRef.current && e.key === ' ') {
          isKeyDownRef.current = false;
          rippleRef.current.stop();
        }
        onKeyUp?.(e);
      },
    );

    const handleClick = useEventCallback(
      (e: React.MouseEvent<HTMLButtonElement & HTMLLinkElement>) => {
        if (loading || disabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      },
    );
    return (
      <BaseButtonRoot
        {...others}
        as={Component}
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onDragLeave={handleDragLeave}
      >
        {children}
        <Ripple ref={rippleRef} leaveAfterEnter={true} />
      </BaseButtonRoot>
    );
  },
);

if (isDevelopment) {
  BaseButton.displayName = displayName;

  BaseButton.propTypes = {
    children: PropTypes.node,
    href: PropTypes.string,
    disabled: PropTypes.bool,
    disableRipple: PropTypes.bool,
    loading: PropTypes.bool,
  };
}

export default BaseButton;
