import { useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import { forwardRef, HTMLAttributes, MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import Transition from '../../Transition';
import { styled } from '../../styles';
import usePropChange from '../../hooks/usePropChange';
import { useTheme } from '../../ThemeProvider';

export type InnerMessageProps = HTMLAttributes<HTMLDivElement> & {
  defaultVisible?: boolean;
  visible?: boolean;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
  onAfterClosed?: () => void;
};

const displayName = 'InnerMessage';

const InnerMessageRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition, color, elevations, styleSize } = theme;

  const rootClassName = `${clsPrefix}-inner-message`;

  return {
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
  };
});

const InnerMessageIcon = styled('span', {
  name: displayName,
  slot: 'Icon',
})(() => {
  return {
    paddingRight: 5,
    lineHeight: 1,
    svg: {
      verticalAlign: 'middle',
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
    ...others
  } = props;

  const { clsPrefix } = useTheme();

  const rootClassName = `${clsPrefix}-inner-message`;

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
    timerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, duration);
  });

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

  return (
    <Transition
      transitionClassName={clsx(rootClassName, className)}
      transitionOnFirst={true}
      in={visible}
      onExited={handleExit}
    >
      <InnerMessageRoot
        ref={ref}
        {...others}
        className={rootClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`${rootClassName}__inner`}>
          {icon && <InnerMessageIcon className={`${rootClassName}__icon`}>{icon}</InnerMessageIcon>}
          <div>{content}</div>
        </div>
      </InnerMessageRoot>
    </Transition>
  );
});

if (!isProduction) {
  InnerMessage.displayName = displayName;
  InnerMessage.propTypes = {};
}

export default InnerMessage;
