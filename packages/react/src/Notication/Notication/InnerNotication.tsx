import { NoticationProps, useEvent, useValueChange } from '@xl-vision/hooks';
import { CloseOutlined } from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { styled } from '../../styles';
import { useTheme } from '../../ThemeProvider';
import Transition from '../../Transition';
import NoticationContext from '../context';

export type InnerNoticationProps = NoticationProps<
  HTMLAttributes<HTMLDivElement> & {
    message: ReactNode;
    closeIcon?: ReactNode;
    description?: ReactNode;
    duration?: number;
    footer?: ReactNode;
    hideClose?: boolean;
    icon?: ReactNode;
  }
>;

const displayName = 'InnerNotication';

const InnerNoticationRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition, color, elevations, styleSize, typography } = theme;

  const rootClassName = `${clsPrefix}-inner-notication`;

  return {
    display: 'inline-block',
    padding: `8px 0`,
    textAlign: 'left',
    color: theme.color.text.primary,

    [`&.${rootClassName}`]: {
      '&-appear-active, &-enter-active': {
        transition: transition.standard('all'),
      },
      '&-exit-active': {
        transition: transition.standard('all'),
      },
      '&-exit-from': {
        opacity: 1,
        maxHeight: 150,
      },
      '&-exit-to': {
        opacity: 0,
        maxHeight: 0,
      },
      '&-enter-from, &-appear-from': {
        opacity: 0,
        [`&.${rootClassName}--top-right, &.${rootClassName}--bottom-right`]: {
          transform: 'translateX(100%)',
        },
        [`&.${rootClassName}--top-left, &.${rootClassName}--bottom-left`]: {
          transform: 'translateX(-100%)',
        },
      },
      '&-appear-to, &-enter-to': {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },

    [`.${rootClassName}__inner`]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: color.background.paper,
      borderRadius: styleSize.large.borderRadius,
      padding: `${styleSize.large.padding.x}px ${styleSize.large.padding.x}px`,
      width: 384,
      ...elevations(12),
    },
    [`.${rootClassName}__status, .${rootClassName}__close`]: {
      lineHeight: 1,
      svg: {
        verticalAlign: 'middle',
      },
    },
    [`.${rootClassName}__status`]: {
      paddingRight: 8,
      fontSize: '1.5rem',
    },
    [`.${rootClassName}__content`]: {
      flex: 1,
      display: 'block',
    },
    [`.${rootClassName}__message`]: {
      ...typography.subtitle1.style,
    },
    [`.${rootClassName}__description`]: {
      ...typography.body2.style,
      marginTop: 8,
    },
    [`.${rootClassName}__footer`]: {
      marginTop: 16,
      float: 'right',
    },
    [`.${rootClassName}__close`]: {
      display: 'inline-block',
      padding: 0,
      marginLeft: 'auto',
      lineHeight: typography.subtitle1.info.lineHeight,
      cursor: 'pointer',
      color: color.text.icon,
      transition: transition.standard('color'),

      '&:hover, &:focus': {
        color: color.text.primary,
      },
    },
  };
});

const InnerNotication = forwardRef<HTMLDivElement, InnerNoticationProps>((props, ref) => {
  const {
    duration = 4500,
    defaultOpen = true,
    open: openProp,
    icon,
    onAfterClosed,
    className,
    onMouseEnter,
    onMouseLeave,
    message,
    description,
    footer,
    hideClose,
    closeIcon,
    ...others
  } = props;

  const { placement } = useContext(NoticationContext);

  const { clsPrefix } = useTheme();

  const [open, setOpen] = useValueChange(defaultOpen, openProp);

  const timerRef = useRef<number>();

  const handleExit = useEvent(() => {
    onAfterClosed?.();
  });

  const handleMouseEnter = useEvent((e: MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(e);
    window.clearTimeout(timerRef.current);
  });

  const handleMouseLeave = useEvent((e: MouseEvent<HTMLDivElement>) => {
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
      window.clearTimeout(timerRef.current);
    };
  }, [duration, setOpen]);

  const rootClassName = `${clsPrefix}-inner-notication`;

  return (
    <Transition
      in={open}
      transitionClassName={rootClassName}
      transitionOnFirst={true}
      onExited={handleExit}
    >
      <InnerNoticationRoot
        ref={ref}
        {...others}
        className={clsx(rootClassName, `${rootClassName}--${placement}`, className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`${rootClassName}__inner`}>
          {icon && <span className={`${rootClassName}__status`}>{icon}</span>}
          <div className={`${rootClassName}__content`}>
            <div className={`${rootClassName}__message`}>{message}</div>
            {description && <div className={`${rootClassName}__description`}>{description}</div>}
            {footer && <div className={`${rootClassName}__footer`}>{footer}</div>}
          </div>
          {!hideClose && (
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
      </InnerNoticationRoot>
    </Transition>
  );
});

if (!isProduction) {
  InnerNotication.displayName = displayName;
  InnerNotication.propTypes = {
    message: PropTypes.node.isRequired,
    className: PropTypes.string,
    closeIcon: PropTypes.node,
    defaultOpen: PropTypes.bool,
    description: PropTypes.node,
    duration: PropTypes.number,
    footer: PropTypes.node,
    hideClose: PropTypes.bool,
    icon: PropTypes.node,
    open: PropTypes.bool,
    onAfterClosed: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  };
}

export default InnerNotication;
