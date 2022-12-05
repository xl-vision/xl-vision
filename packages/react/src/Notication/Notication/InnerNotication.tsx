import { NoticationProps, useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import {
  forwardRef,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
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
    icon?: ReactNode;
    duration?: number;
    hideClose?: boolean;
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
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: color.background.paper,
      borderRadius: styleSize.middle.borderRadius,
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
      display: 'block',
    },
    [`.${rootClassName}__message`]: {
      ...typography.subtitle1.style,
    },
    [`.${rootClassName}__description`]: {
      ...typography.body2.style,
      marginTop: 8,
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
    duration = 3000,
    defaultVisible = true,
    visible: visibleProp,
    icon,
    onAfterClosed,
    className,
    onMouseEnter,
    onMouseLeave,
    message,
    description,
    hideClose,
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
    // timerRef.current = window.setTimeout(() => {
    //   setVisible(false);
    // }, duration);
  });

  const handleClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  // useEffect(() => {
  //   if (!duration) {
  //     return;
  //   }
  //   timerRef.current = window.setTimeout(() => {
  //     setVisible(false);
  //   }, duration);

  //   return () => {
  //     window.clearTimeout(timerRef.current);
  //   };
  // }, [duration, setVisible]);

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
            <div className={`${rootClassName}__description`}>{description}</div>
          </div>
          {!hideClose && (
            <span onClick={handleClose} className={`${rootClassName}__close`}>
              <CloseOutlined />
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
