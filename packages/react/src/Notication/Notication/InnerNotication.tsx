import { NoticationProps, useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
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
import { clsx } from 'clsx';
import { CloseOutlined } from '@xl-vision/icons';
import Transition from '../../Transition';
import { styled } from '../../styles';
import usePropChange from '../../hooks/usePropChange';
import { useTheme } from '../../ThemeProvider';
import NoticationContext from '../context';

export type InnerNoticationProps = NoticationProps<
  HTMLAttributes<HTMLDivElement> & {
    message: ReactNode;
    description?: ReactNode;
    footer?: ReactNode;
    icon?: ReactNode;
    duration?: number;
    hideClose?: boolean;
    closeIcon?: ReactNode;
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
    defaultVisible = true,
    visible: visibleProp,
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

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp);

  const timerRef = useRef<number>();

  const handleExit = useConstantFn(() => {
    onAfterClosed?.();
  });

  const handleMouseEnter = useConstantFn((e: MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(e);
    window.clearTimeout(timerRef.current);
  });

  const handleMouseLeave = useConstantFn((e: MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);

    if (!duration) {
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, duration);
  });

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleCloseKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSpanElement>) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        setVisible(false);
      }
    },
    [setVisible],
  );

  useEffect(() => {
    if (!duration) {
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [duration, setVisible]);

  const rootClassName = `${clsPrefix}-inner-notication`;

  return (
    <Transition
      transitionClassName={rootClassName}
      transitionOnFirst={true}
      in={visible}
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
              tabIndex={0}
              role='button'
              onKeyDown={handleCloseKeyDown}
              onClick={handleClose}
              className={`${rootClassName}__close`}
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
  InnerNotication.propTypes = {};
}

export default InnerNotication;
