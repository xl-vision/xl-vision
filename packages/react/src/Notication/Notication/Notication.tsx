import {
  NoticationProps as NoticationHookProps,
  useConstantFn,
  useValueChange,
} from '@xl-vision/hooks';
import { CloseOutlined } from '@xl-vision/icons';
import { isProduction } from '@xl-vision/utils';
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
import memoStyled from '../../memoStyled';
import { useTheme } from '../../ThemeProvider';
import Transition from '../../Transition';
import NoticationContext from '../context';
import { NoticationPlacement } from '../NoticationContainer';

export type NoticationProps = NoticationHookProps &
  HTMLAttributes<HTMLDivElement> & {
    message: ReactNode;
    closeIcon?: ReactNode;
    description?: ReactNode;
    duration?: number;
    footer?: ReactNode;
    hideClose?: boolean;
    icon?: ReactNode;
  };

const displayName = 'Notication';

const NoticationRoot = memoStyled('div', {
  name: displayName,
  slot: 'Root',
})<{ placement: NoticationPlacement }>(({ theme }) => {
  const { clsPrefix, transitions } = theme;

  const rootClassName = `${clsPrefix}-notication`;

  return {
    display: 'inline-block',
    padding: `8px 0`,
    textAlign: 'left',
    color: theme.colors.text.primary,

    [`&.${rootClassName}`]: {
      '&-appear-active, &-enter-active': {
        transition: transitions.standard('all'),
      },
      '&-exit-active': {
        transition: transitions.standard('all'),
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
        [`&.${rootClassName}--placement-top-right, &.${rootClassName}--placement-bottom-right`]: {
          transform: 'translateX(100%)',
        },
        [`&.${rootClassName}--placement-top-left, &.${rootClassName}--placement-bottom-left`]: {
          transform: 'translateX(-100%)',
        },
      },
      '&-appear-to, &-enter-to': {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
  };
});

const NoticationInner = memoStyled('div', {
  name: displayName,
  slot: 'Inner',
})(({ theme: { colors, sizes, elevations } }) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background.popper,
    borderRadius: sizes.large.borderRadius,
    padding: `${sizes.large.padding.x}px ${sizes.large.padding.x}px`,
    width: 384,
    boxShadow: elevations[3],
  };
});

const NoticationFooter = memoStyled('div', {
  name: displayName,
  slot: 'Footer',
})(() => {
  return {
    marginTop: 16,
    float: 'right',
  };
});

const NoticationDescription = memoStyled('div', {
  name: displayName,
  slot: 'Description',
})(({ theme: { typography } }) => {
  return {
    ...typography.body2.style,
    marginTop: 8,
  };
});

const NoticationMessage = memoStyled('div', {
  name: displayName,
  slot: 'Message',
})(({ theme: { typography } }) => {
  return {
    ...typography.subtitle1.style,
  };
});

const NoticationContent = memoStyled('div', {
  name: displayName,
  slot: 'Content',
})(() => {
  return {
    flex: 1,
    display: 'block',
  };
});

const NoticationIcon = memoStyled('span', {
  name: displayName,
  slot: 'Icon',
})(() => {
  return {
    lineHeight: 1,
    svg: {
      verticalAlign: 'middle',
    },
  };
});

const NoticationIconStatus = memoStyled(NoticationIcon, {
  name: displayName,
  slot: 'Status',
})(() => {
  return {
    paddingRight: 8,
    fontSize: '1.5rem',
  };
});

const NoticationIconClose = memoStyled(NoticationIcon, {
  name: displayName,
  slot: 'Close',
})(({ theme: { typography, colors, transitions } }) => {
  return {
    display: 'inline-block',
    padding: 0,
    marginLeft: 'auto',
    lineHeight: typography.subtitle1.info.lineHeight,
    cursor: 'pointer',
    color: colors.text.hint,
    transition: transitions.standard('color'),

    '&:hover, &:focus': {
      color: colors.text.primary,
    },
  };
});

const NoticationInternal = forwardRef<HTMLDivElement, NoticationProps>((props, ref) => {
  const {
    duration = 4500,
    onOpenChange,
    open: openProp,
    icon,
    onAfterClosed,
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

  const [open, setOpen] = useValueChange(false, openProp, onOpenChange);

  const timerRef = useRef<number>(null);

  const handleExited = useConstantFn(() => {
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

  const rootClassName = `${clsPrefix}-notication`;

  return (
    <Transition
      in={open}
      transitionClassName={rootClassName}
      transitionOnFirst={true}
      onExited={handleExited}
    >
      <NoticationRoot
        ref={ref}
        {...others}
        styleProps={{ placement }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NoticationInner>
          {icon && <NoticationIconStatus>{icon}</NoticationIconStatus>}
          <NoticationContent>
            <NoticationMessage>{message}</NoticationMessage>
            {description && <NoticationDescription>{description}</NoticationDescription>}
            {footer && <NoticationFooter>{footer}</NoticationFooter>}
          </NoticationContent>
          {!hideClose && (
            <NoticationIconClose
              role='button'
              tabIndex={0}
              onClick={handleClose}
              onKeyDown={handleCloseKeyDown}
            >
              {closeIcon || <CloseOutlined />}
            </NoticationIconClose>
          )}
        </NoticationInner>
      </NoticationRoot>
    </Transition>
  );
});

if (!isProduction) {
  NoticationInternal.displayName = displayName;
  NoticationInternal.propTypes = {
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

export default NoticationInternal;
