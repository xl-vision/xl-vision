import { NoticationProps, useConstantFn } from '@xl-vision/hooks';
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
import { clsx } from 'clsx';
import { CloseOutlined } from '@xl-vision/icons';
import Transition from '../../Transition';
import { styled } from '../../styles';
import usePropChange from '../../hooks/usePropChange';
import { useTheme } from '../../ThemeProvider';

export type InnerMessageProps = NoticationProps<
  HTMLAttributes<HTMLDivElement> & {
    content: ReactNode;
    icon?: ReactNode;
    duration?: number;
    showClose?: boolean;
    closeIcon?: ReactNode;
  }
>;

const displayName = 'InnerMessage';

const InnerMessageRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition, color, elevations, styleSize } = theme;

  const rootClassName = `${clsPrefix}-inner-message`;

  return {
    display: 'inline-block',
    padding: `8px 0`,

    [`&.${rootClassName}`]: {
      '&-appear-active, &-enter-active': {
        transition: transition.standard('all'),
      },
      '&-exit-active': {
        transition: transition.standard('all'),
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
      backgroundColor: color.background.paper,
      borderRadius: styleSize.middle.borderRadius,
      padding: `${styleSize.middle.padding.y}px ${styleSize.middle.padding.x}px`,
      ...elevations(12),
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
      color: color.text.icon,
      transition: transition.standard('color'),
      '&:hover, &:focus': {
        color: color.text.primary,
      },
    },
  };
});

const InnerMessage = forwardRef<HTMLDivElement, InnerMessageProps>((props, ref) => {
  const {
    duration = 3000,
    content,
    defaultVisible = true,
    visible: visibleProp,
    icon,
    onAfterClosed,
    className,
    onMouseEnter,
    onMouseLeave,
    showClose,
    closeIcon,
    ...others
  } = props;

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

  const rootClassName = `${clsPrefix}-inner-message`;

  return (
    <Transition
      in={visible}
      transitionClassName={rootClassName}
      transitionOnFirst={true}
      onExited={handleExit}
    >
      <InnerMessageRoot
        ref={ref}
        {...others}
        className={clsx(rootClassName, className)}
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
    defaultValue: PropTypes.bool,
    duration: PropTypes.number,
    icon: PropTypes.node,
    showClose: PropTypes.bool,
    visible: PropTypes.bool,
    onAfterClosed: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  };
}

export default InnerMessage;
