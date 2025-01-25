import { useConstantFn, useValueChange } from '@xl-vision/hooks';
import { VerticalAlignTopOutlined } from '@xl-vision/icons';
import { isProduction, isServer, off, on } from '@xl-vision/utils';
import PropTypes from 'prop-types';
import {
  HTMLAttributes,
  forwardRef,
  useState,
  useEffect,
  CSSProperties,
  MouseEvent,
  useRef,
  useImperativeHandle,
} from 'react';
import Portal from '../Portal';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import Transition from '../Transition';
import { RefInstance } from '../types';
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

export type BackTopInstance = RefInstance<HTMLDivElement>;

const displayName = 'BackTop';

const BackTopRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { transitions, clsPrefix } = theme;

  const rootClassName = `${clsPrefix}-back-top`;

  return {
    position: 'fixed',
    zIndex: 10,
    ...transitions.fadeIn(`&.${rootClassName}`),
    ...transitions.fadeOut(`&.${rootClassName}`),
  };
});

const BackTopInner = styled('div', {
  name: displayName,
  slot: 'Inner',
})(({ theme: { colors, transitions, elevations } }) => {
  return {
    fontSize: 24,
    backgroundColor: colors.text.hint,
    color: colors.background.paper,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: transitions.standard('backgroundColor'),
    boxShadow: elevations[3],
    '&:hover': {
      backgroundColor: colors.text.secondary,
    },
  };
});

const getDefaultTarget = () => window;
const getDefaultContainer = () => document.body;

const BackTop = forwardRef<BackTopInstance, BackTopProps>((props, ref) => {
  const { clsPrefix } = useTheme();

  const {
    target = getDefaultTarget,
    container: containerProp = getDefaultContainer,
    bottom = 40,
    right = 40,
    show: showProp,
    onChange,
    visibilityHeight = 300,
    children,
    style,
    onClick,
    ...others
  } = props;

  const [show, setShow] = useValueChange(false, showProp, onChange);

  const [currentTarget, setCurrentTarget] = useState<Window | HTMLElement>();

  const rootRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return {
      get nativeElement() {
        return rootRef.current;
      },
    };
  }, []);

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

  const defaultElement = (
    <BackTopInner>
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
        ref={rootRef}
        style={{ ...style, ...fixedStyle }}
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
