import { useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import { forwardRef, HTMLAttributes, ReactNode, useEffect } from 'react';
import { clsx } from 'clsx';
import Transition from '../../Transition';
import { styled } from '../../styles';
import usePropChange from '../../hooks/usePropChange';
import { useTheme } from '../../ThemeProvider';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  defaultVisible?: boolean;
  visible?: boolean;
  content: ReactNode;
  icon?: ReactNode;
  duration?: number;
  onAfterClosed?: () => void;
};

const displayName = 'Message';

const MessageRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, transition, color, elevations, styleSize } = theme;

  const rootClassName = `${clsPrefix}-message`;

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

const MessageIcon = styled('span', {
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

const Message = forwardRef<HTMLDivElement, MessageProps>((props, ref) => {
  const {
    duration = 3000,
    content,
    defaultVisible = true,
    visible: visibleProp,
    icon,
    onAfterClosed,
    className,
  } = props;

  const { clsPrefix } = useTheme();

  const rootClassName = `${clsPrefix}-message`;

  const [visible, setVisible] = usePropChange(defaultVisible, visibleProp);

  const handleExit = useConstantFn(() => {
    onAfterClosed?.();
  });

  useEffect(() => {
    if (!duration) {
      return;
    }
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, setVisible]);

  return (
    <Transition
      transitionClassName={clsx(rootClassName, className)}
      transitionOnFirst={true}
      in={visible}
      onExited={handleExit}
    >
      <MessageRoot className={rootClassName} ref={ref}>
        <div className={`${rootClassName}__inner`}>
          {icon && <MessageIcon className={`${rootClassName}__icon`}>{icon}</MessageIcon>}
          <div>{content}</div>
        </div>
      </MessageRoot>
    </Transition>
  );
});

if (!isProduction) {
  Message.displayName = displayName;
  Message.propTypes = {};
}

export default Message;
