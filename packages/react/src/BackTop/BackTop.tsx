import { useConstantFn } from '@xl-vision/hooks';
import { VerticalAlignTopOutlined } from '@xl-vision/icons';
import { env } from '@xl-vision/utils';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import CssTransition from '../CssTransition';
import usePropChange from '../hooks/usePropChange';
import Portal from '../Portal';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import { alpha } from '../utils/color';
import { getScroll } from '../utils/dom';
import { off, on } from '../utils/event';
import { throttleByAnimationFrame } from '../utils/perf';

export type BackTopProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'target' | 'onChange'> & {
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

const BackTop = React.forwardRef<HTMLDivElement, BackTopProps>((props, ref) => {
  const { clsPrefix } = useTheme();

  const {
    target: targetProp = getDefaultTarget,
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

  const [currentTarget, setCurrentTarget] = React.useState<Window | HTMLElement>();

  const getTarget = useConstantFn(() => {
    return typeof targetProp === 'function' ? targetProp() : targetProp;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const nextTarget = getTarget();
    if (currentTarget === nextTarget) {
      return;
    }
    setCurrentTarget(nextTarget);
  });

  React.useEffect(() => {
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

  const handleClick = useConstantFn((e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);

    if (!currentTarget) {
      return;
    }
    if (currentTarget.scrollTo) {
      currentTarget.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      (currentTarget as HTMLElement).scrollTop = 0;
    }
  });

  const rootClassName = `${clsPrefix}-back-top`;

  const classes = clsx(rootClassName, className);

  const defaultElement = (
    <div className={`${rootClassName}__inner`}>
      <VerticalAlignTopOutlined />
    </div>
  );

  const fixedStyle: React.CSSProperties = {
    right,
    bottom,
  };

  const node = (
    <CssTransition
      in={show}
      mountOnEnter={true}
      unmountOnLeave={true}
      transitionClasses={rootClassName}
    >
      <Root
        {...others}
        onClick={handleClick}
        style={{ ...style, ...fixedStyle }}
        className={classes}
        ref={ref}
      >
        {children || defaultElement}
      </Root>
    </CssTransition>
  );

  return <Portal getContainer={containerProp}>{node}</Portal>;
});

if (!env.isProduction) {
  BackTop.displayName = displayName;
  BackTop.propTypes = {
    target: PropTypes.oneOfType([
      PropTypes.func,
      ...(env.isServer
        ? [PropTypes.any]
        : [PropTypes.instanceOf(Window), PropTypes.instanceOf(HTMLElement)]),
    ]),
    container: PropTypes.oneOfType([
      PropTypes.func,
      ...(env.isServer ? [PropTypes.any] : [PropTypes.instanceOf(Element)]),
    ]),
    bottom: PropTypes.number,
    right: PropTypes.number,
    show: PropTypes.bool,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    visibilityHeight: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
  };
}

export default BackTop;
