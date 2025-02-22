import { NoticationProps, useConstantFn, useValueChange } from '@xl-vision/hooks';
import { CloseOutlined } from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import {
  forwardRef,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  KeyboardEvent,
} from 'react';
import { styled } from '../../styles';
import { useTheme } from '../../ThemeProvider';
import Transition from '../../Transition';

export type InnerMessageProps = NoticationProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'content'> & {
    content: ReactNode;
    closeIcon?: ReactNode;
    duration?: number;
    icon?: ReactNode;
    showClose?: boolean;
  };

const displayName = 'InnerMessage';

const InnerMessageRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { transitions, colors, elevations, sizes, clsPrefix } = theme;

  const rootClassName = `${clsPrefix}-inner-message`;

  return {
    display: 'inline-block',
    padding: `8px 0`,
    color: theme.colors.text.primary,

    [`&.${rootClassName}`]: {
      '&-appear-active, &-enter-active': {
        transition: transitions.standard('all'),
      },
      '&-exit-active': {
        transition: transitions.standard('all'),
      },
      '&-enter-from, &-appear-from': {
        opacity: 0,
        transform: 'translateY(-100%)',
      },
      '&-appear-to, &-enter-to': {
        opacity: 1,
        transform: 'translateY(0px)',
      },
      '&-exit-from': {
        opacity: 1,
        maxHeight: 150,
      },
      '&-exit-to': {
        opacity: 0,
        padding: 0,
        maxHeight: 0,
      },
    },

    [`.${rootClassName}__inner`]: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: colors.background.popper,
      borderRadius: sizes.middle.borderRadius,
      padding: `${sizes.middle.padding.y}px ${sizes.middle.padding.x}px`,
      boxShadow: elevations[3],
    },
    [`.${rootClassName}__status, .${rootClassName}__close`]: {
      lineHeight: 1,
      svg: {
        verticalAlign: 'middle',
      },
    },
    [`.${rootClassName}__status`]: {
      paddingRight: 5,
    },
    [`.${rootClassName}__close`]: {
      display: 'inline-block',
      padding: 0,
      marginLeft: 5,
      cursor: 'pointer',
      color: colors.text.hint,
      transition: transitions.standard('color'),
      '&:hover, &:focus': {
        color: colors.text.primary,
      },
    },
  };
});

const InnerMessage = forwardRef<HTMLDivElement, InnerMessageProps>((props, ref) => {
  const {
    duration = 3000,
    content,
    onOpenChange,
    open: openProp,
    icon,
    onAfterClosed,
    onMouseEnter,
    onMouseLeave,
    showClose,
    closeIcon,
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const [open, setOpen] = useValueChange(false, openProp, onOpenChange);

  const timerRef = useRef<number>(null);

  const handleExit = useConstantFn(() => {
    onAfterClosed?.();
  });

  const handleMouseEnter = useConstantFn((e: MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(e);
    const timer = timerRef.current;
    if (timer) {
      clearTimeout(timer);
    }
  });

  const handleMouseLeave = useConstantFn((e: MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);

    if (!duration) {
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, duration);
  });

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleCloseKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSpanElement>) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        setOpen(false);
      }
    },
    [setOpen],
  );

  useEffect(() => {
    if (!duration) {
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, duration);

    return () => {
      const timer = timerRef.current;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [duration, setOpen]);

  const rootClassName = `${clsPrefix}-inner-message`;

  return (
    <Transition
      in={open}
      transitionClassName={rootClassName}
      transitionOnFirst={true}
      onExited={handleExit}
    >
      <InnerMessageRoot
        ref={ref}
        {...others}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`${rootClassName}__inner`} role='alert'>
          {icon && <span className={`${rootClassName}__status`}>{icon}</span>}
          <div className={`${rootClassName}__content`}>{content}</div>
          {showClose && (
            <span
              className={`${rootClassName}__close`}
              role='button'
              tabIndex={0}
              onClick={handleClose}
              onKeyDown={handleCloseKeyDown}
            >
              {closeIcon || <CloseOutlined />}
            </span>
          )}
        </div>
      </InnerMessageRoot>
    </Transition>
  );
});

if (!isProduction) {
  InnerMessage.displayName = displayName;
  InnerMessage.propTypes = {
    content: PropTypes.node.isRequired,
    closeIcon: PropTypes.node,
    defaultOpen: PropTypes.bool,
    duration: PropTypes.number,
    icon: PropTypes.node,
    open: PropTypes.bool,
    showClose: PropTypes.bool,
    onAfterClosed: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  };
}

export default InnerMessage;
