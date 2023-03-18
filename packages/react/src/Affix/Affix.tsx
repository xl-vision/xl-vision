import {
  LifecycleState,
  useConstantFn,
  useForkRef,
  useIsomorphicLayoutEffect,
  useLifecycleState,
} from '@xl-vision/hooks';
import { getBoundingClientRect, isProduction, isServer } from '@xl-vision/utils';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  HTMLAttributes,
  forwardRef,
  useState,
  CSSProperties,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import {
  addTargetObserver,
  removeTargetObserver,
  getFixedBottom,
  getFixedTop,
  getTargetRect,
} from './utils';
import { useConfig } from '../ConfigProvider';
import ResizeObserver from '../ResizeObserver';
import { styled } from '../styles';
import { throttleByAnimationFrame } from '../utils/perf';

export type AffixProps = Omit<HTMLAttributes<HTMLDivElement>, 'target' | 'onChange'> & {
  target?: Window | HTMLElement | (() => Window | HTMLElement);
  offsetTop?: number;
  offsetBottom?: number;
  onChange?: (affixed: boolean) => void;
};

const displayName = 'Affix';

const AffixRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ clsPrefix }) => {
  return {
    [`.${clsPrefix}-affix__inner`]: {
      zIndex: 1,
    },
  };
});

const getDefaultTarget = () => {
  return window;
};

enum AffixStatus {
  PREPARE,
  NONE,
}

export type AffixIntance = HTMLDivElement & {
  handleEventEmit: () => void;
  handleSizeChange: () => void;
};

const Affix = forwardRef<AffixIntance, AffixProps>((props, ref) => {
  const { clsPrefix } = useConfig();

  const {
    target = getDefaultTarget,
    onChange,
    offsetBottom,
    offsetTop,
    className,
    children,
    ...others
  } = props;

  const [affixStyle, setAffixStyle] = useState<CSSProperties>();
  const [placeholderStyle, setPlaceholderStyle] = useState<CSSProperties>();

  const rootRef = useRef<AffixIntance>(null);

  const forkRef = useForkRef(ref, rootRef);

  const [currentTarget, setCurrentTarget] = useState<Window | HTMLElement>();

  const [isAffixed, setAffixed] = useState<boolean>();

  const [status, setStatus] = useState(AffixStatus.NONE);

  const lifecycleStateRef = useLifecycleState();

  const measure = useConstantFn(() => {
    const affixNode = rootRef.current;
    if (!affixNode || !currentTarget) {
      return;
    }

    const targetRect = getTargetRect(currentTarget);
    const affixRect = getBoundingClientRect(affixNode);
    const top = getFixedTop(affixRect, targetRect, offsetTop);
    const bottom = getFixedBottom(affixRect, targetRect, offsetBottom);

    let isCurrentAffixed = false;

    if (top !== undefined || bottom !== undefined) {
      setPlaceholderStyle({
        width: affixRect.width,
        height: affixRect.height,
      });
      isCurrentAffixed = true;

      if (top !== undefined) {
        setAffixStyle({
          position: 'fixed',
          top,
          width: affixRect.width,
          height: affixRect.height,
        });
      } else {
        setAffixStyle({
          position: 'fixed',
          bottom,
          width: affixRect.width,
          height: affixRect.height,
        });
      }
    } else {
      setPlaceholderStyle(undefined);
      setAffixStyle(undefined);
    }

    if (isAffixed !== isCurrentAffixed) {
      onChange?.(isCurrentAffixed);
      setAffixed(isCurrentAffixed);
    }
  });

  // 当尺寸信息发生变化时，需要清空样式重新计算
  const handleSizeChange = useMemo(() => {
    return throttleByAnimationFrame(() => {
      if (lifecycleStateRef.current === LifecycleState.DESTORYED) {
        return;
      }
      setPlaceholderStyle(undefined);
      setAffixStyle(undefined);
      setStatus(AffixStatus.PREPARE);
    });
  }, [lifecycleStateRef]);

  const handleEventEmit = useMemo(() => {
    return throttleByAnimationFrame(() => {
      if (lifecycleStateRef.current === LifecycleState.DESTORYED) {
        return;
      }
      setStatus(AffixStatus.PREPARE);
    });
  }, [lifecycleStateRef]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) {
      return;
    }
    node.handleEventEmit = handleEventEmit;
    node.handleSizeChange = handleSizeChange;
  }, [handleEventEmit, handleSizeChange]);

  useEffect(() => {
    return () => {
      handleSizeChange.cancel?.();
    };
  }, [handleSizeChange]);

  useEffect(() => {
    return () => {
      handleEventEmit.cancel?.();
    };
  }, [handleEventEmit]);

  // 保证同步更新，避免闪烁
  useIsomorphicLayoutEffect(() => {
    if (status === AffixStatus.PREPARE) {
      setStatus(AffixStatus.NONE);
      measure();
    }
  }, [status, measure]);

  useEffect(() => {
    const nextTarget = typeof target === 'function' ? target() : target;
    setCurrentTarget(nextTarget);
  }, [target]);

  useEffect(() => {
    if (!currentTarget) {
      return;
    }

    addTargetObserver(currentTarget, handleEventEmit);
    return () => {
      removeTargetObserver(currentTarget, handleEventEmit);
    };
  }, [currentTarget, handleEventEmit]);

  const rootClassName = `${clsPrefix}-affix`;

  const classes = clsx(
    {
      [`${rootClassName}--fixed`]: !!affixStyle,
    },
    className,
  );

  return (
    <ResizeObserver onResizeObserver={handleSizeChange}>
      <AffixRoot {...others} className={classes} ref={forkRef}>
        {placeholderStyle && (
          <div
            aria-hidden={true}
            className={`${rootClassName}__placeholder`}
            style={placeholderStyle}
          />
        )}
        <div className={`${rootClassName}__inner`} style={affixStyle}>
          <ResizeObserver onResizeObserver={handleSizeChange}>{children}</ResizeObserver>
        </div>
      </AffixRoot>
    </ResizeObserver>
  );
});

if (!isProduction) {
  Affix.displayName = displayName;
  Affix.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    offsetBottom: PropTypes.number,
    offsetTop: PropTypes.number,
    target: PropTypes.oneOfType([
      PropTypes.func,
      ...(isServer
        ? [PropTypes.any]
        : [PropTypes.instanceOf(Window), PropTypes.instanceOf(HTMLElement)]),
    ]),
    onChange: PropTypes.func,
  };
}

export default Affix;
