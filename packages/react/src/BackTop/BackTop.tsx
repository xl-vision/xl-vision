import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { VerticalAlignTopOutlined } from '@xl-vision/icons';
import { isProduction, isServer, off, on } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { HTMLAttributes, forwardRef, useState, useEffect, CSSProperties, MouseEvent } from 'react';
import { useConfig } from '../ConfigProvider';
import Portal from '../Portal';
import { styled } from '../styles';
import Transition from '../Transition';
import { alpha } from '../utils/color';
import { throttleByAnimationFrame } from '../utils/perf';
import { getScroll, scrollTo } from '../utils/scroll';

export type BackTopProps = Omit<HTMLAttributes<HTMLDivElement>, 'target' | 'onChange'> & {
  target?: Window | HTMLElement | (() => Window | HTMLElement);
  container?: Element | (() => Element);
  bottom?: number | string;
  right?: number | string;
  show?: boolean;
  onChange?: (show: boolean) => void;
  visibilityHeight?: number;
};

const displayName = 'BackTop';

const BackTopRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})<{ transitionClassName: string }>(({ theme, styleProps }) => {
  const { transition } = theme;

  const { transitionClassName } = styleProps;

  return {
    position: 'fixed',
    zIndex: 10,
    ...transition.fadeIn(`&.${transitionClassName}`),
    ...transition.fadeOut(`&.${transitionClassName}`),
  };
});

const BackTopInner = styled('div', {
  name: displayName,
  slot: 'Inner',
})(({ theme }) => {
  const { color, transition } = theme;

  const bgColor = alpha(color.text.primary, 0.4);

  const contrastColor = color.getContrastColor(bgColor);

  return {
    fontSize: 24,
    backgroundColor: bgColor,
    color: contrastColor.text.primary,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: transition.standard('backgroundColor'),
    '&:hover': {
      backgroundColor: alpha(color.text.primary, 0.7),
    },
  };
});

const getDefaultTarget = () => window;
const getDefaultContainer = () => document.body;

const BackTop = forwardRef<HTMLDivElement, BackTopProps>((props, ref) => {
  const { clsPrefix } = useConfig();

  const {
    target = getDefaultTarget,
    container: containerProp = getDefaultContainer,
    bottom = 40,
    right = 40,
    show: showProp,
    onChange,
    visibilityHeight = 300,
    className,
    children,
    style,
    onClick,
    ...others
  } = props;

  const [show, setShow] = useValueChange(false, showProp, onChange);

  const [currentTarget, setCurrentTarget] = useState<Window | HTMLElement>();

  useEffect(() => {
    const nextTarget = typeof target === 'function' ? target() : target;

    setCurrentTarget(nextTarget);
  }, [target]);

  useEffect(() => {
    if (!currentTarget) {
      return;
    }

    const handleScroll = throttleByAnimationFrame(() => {
      const scrollTop = getScroll(currentTarget, true);
      setShow(scrollTop > visibilityHeight);
    });

    handleScroll();

    on(currentTarget, 'scroll', handleScroll);

    return () => {
      handleScroll.cancel?.();
      off(currentTarget, 'scroll', handleScroll);
    };
  }, [currentTarget, visibilityHeight, setShow]);

  const handleClick = useConstantFn((e: MouseEvent<HTMLDivElement>) => {
    onClick?.(e);

    if (!currentTarget) {
      return;
    }
    scrollTo(0, {
      container: currentTarget,
    });
  });

  const rootClassName = `${clsPrefix}-back-top`;

  const classes = clsx(rootClassName, className);

  const defaultElement = (
    <BackTopInner className={`${rootClassName}__inner`}>
      <VerticalAlignTopOutlined />
    </BackTopInner>
  );

  const fixedStyle: CSSProperties = {
    right,
    bottom,
  };

  const node = (
    <Transition
      in={show}
      mountOnEnter={true}
      transitionClassName={rootClassName}
      unmountOnExit={true}
    >
      <BackTopRoot
        {...others}
        className={classes}
        ref={ref}
        style={{ ...style, ...fixedStyle }}
        styleProps={{ transitionClassName: rootClassName }}
        onClick={handleClick}
      >
        {children || defaultElement}
      </BackTopRoot>
    </Transition>
  );

  return <Portal container={containerProp}>{node}</Portal>;
});

if (!isProduction) {
  BackTop.displayName = displayName;
  BackTop.propTypes = {
    bottom: PropTypes.number,
    children: PropTypes.node,
    className: PropTypes.string,
    container: PropTypes.oneOfType([
      PropTypes.func,
      ...(isServer ? [PropTypes.any] : [PropTypes.instanceOf(Element)]),
    ]),
    right: PropTypes.number,
    show: PropTypes.bool,
    style: PropTypes.shape({}),
    target: PropTypes.oneOfType([
      PropTypes.func,
      ...(isServer
        ? [PropTypes.any]
        : [PropTypes.instanceOf(Window), PropTypes.instanceOf(HTMLElement)]),
    ]),
    visibilityHeight: PropTypes.number,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
  };
}

export default BackTop;
