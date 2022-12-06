import { useConstantFn } from '@xl-vision/hooks';
import { VerticalAlignTopOutlined } from '@xl-vision/icons';
import { isProduction, isServer, off, on } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { HTMLAttributes, forwardRef, useState, useEffect, CSSProperties, MouseEvent } from 'react';
import Transition from '../Transition';
import usePropChange from '../hooks/usePropChange';
import Portal from '../Portal';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import { alpha } from '../utils/color';
import { getScroll, scrollTo } from '../utils/scroll';
import { throttleByAnimationFrame } from '../utils/perf';

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

const Root = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix, color, transition } = theme;

  const bgColor = alpha(color.text.primary, 0.4);

  const contrastColor = color.getContrastColor(bgColor);

  const rootClassName = `${clsPrefix}-back-top`;

  return {
    position: 'fixed',
    zIndex: 10,
    ...transition.fadeIn(`&.${rootClassName}`),
    ...transition.fadeOut(`&.${rootClassName}`),
    [`.${rootClassName}__inner`]: {
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
    },
  };
});

const getDefaultTarget = () => window;
const getDefaultContainer = () => document.body;

const BackTop = forwardRef<HTMLDivElement, BackTopProps>((props, ref) => {
  const { clsPrefix } = useTheme();

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

  const [show, setShow] = usePropChange(false, showProp, onChange);

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
    <div className={`${rootClassName}__inner`}>
      <VerticalAlignTopOutlined />
    </div>
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
      <Root
        {...others}
        className={classes}
        ref={ref}
        style={{ ...style, ...fixedStyle }}
        onClick={handleClick}
      >
        {children || defaultElement}
      </Root>
    </Transition>
  );

  return <Portal container={containerProp}>{node}</Portal>;
});

if (!isProduction) {
  BackTop.displayName = displayName;
  BackTop.propTypes = {
    target: PropTypes.oneOfType([
      PropTypes.func,
      ...(isServer
        ? [PropTypes.any]
        : [PropTypes.instanceOf(Window), PropTypes.instanceOf(HTMLElement)]),
    ]),
    container: PropTypes.oneOfType([
      PropTypes.func,
      ...(isServer ? [PropTypes.any] : [PropTypes.instanceOf(Element)]),
    ]),
    bottom: PropTypes.number,
    right: PropTypes.number,
    show: PropTypes.bool,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    visibilityHeight: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.shape({}),
    children: PropTypes.node,
  };
}

export default BackTop;
