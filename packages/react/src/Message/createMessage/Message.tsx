import { useConstantFn } from '@xl-vision/hooks';
import { isProduction } from '@xl-vision/utils';
import { forwardRef, ReactNode, useEffect } from 'react';
import Transition from '../../Transition';
import { styled } from '../../styles';
import usePropChange from '../../hooks/usePropChange';
import { useTheme } from '../../ThemeProvider';

export type MessageProps = {
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

  return {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color.background.paper,
    borderRadius: styleSize.middle.borderRadius,
    padding: `${styleSize.middle.padding.y}px ${styleSize.middle.padding.x}px`,
    marginTop: 8,
    ...elevations(24),

    [`&.${clsPrefix}-message`]: {
      '&-appear-active, &-enter-active': {
        transition: transition.standard('all'),
      },
      '&-exit-active': {
        transition: transition.standard('all'),
      },
      '&-enter-from,&-appear-from,&-exit-to': {
        opacity: 0,
        marginTop: 0,
      },
      '&-exit-from,&-appear-to,&-enter-to': {
        opacity: 1,
        marginTop: 8,
      },
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
      transitionClassName={rootClassName}
      transitionOnFirst={true}
      in={visible}
      onExited={handleExit}
    >
      <MessageRoot className={rootClassName} ref={ref}>
        {icon && <MessageIcon className={`${rootClassName}__icon`}>{icon}</MessageIcon>}
        <div>{content}</div>
      </MessageRoot>
    </Transition>
  );
});

if (!isProduction) {
  Message.displayName = displayName;
  Message.propTypes = {};
}

export default Message;
