import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import { useConstantFn, useForkRef, useLayoutEffect } from '@xl-vision/hooks';
import clsx from 'clsx';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import {
  addTargetObserver,
  removeTargetObserver,
  getFixedBottom,
  getFixedTop,
  getTargetRect,
} from './utils';
import { throttleByAnimationFrame } from '../utils/perf';
import ResizeObserver from '../ResizeObserver';

export type AffixProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'target' | 'onChange'> & {
  target?: Window | HTMLElement | (() => Window | HTMLElement);
  offsetTop?: number;
  offsetBottom?: number;
  onChange?: (affixed: boolean) => void;
};

const displayName = 'Affix';

const AffixRoot = styled('div', {
  name: displayName,
  slot: 'Root',
})(({ theme }) => {
  const { clsPrefix } = theme;

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

const Affix = React.forwardRef<AffixIntance, AffixProps>((props, ref) => {
  const { clsPrefix } = useTheme();

  const {
    target = getDefaultTarget,
    onChange,
    offsetBottom,
    offsetTop,
    className,
    children,
    ...others
  } = props;

  const [affixStyle, setAffixStyle] = React.useState<React.CSSProperties>();
  const [placeholderStyle, setPlaceholderStyle] = React.useState<React.CSSProperties>();

  const rootRef = React.useRef<AffixIntance>(null);

  const forkRef = useForkRef(ref, rootRef);

  const [currentTarget, setCurrentTarget] = React.useState<Window | HTMLElement>();

  const [isAffixed, setAffixed] = React.useState<boolean>();

  const [status, setStatus] = React.useState(AffixStatus.NONE);

  const measure = useConstantFn(() => {
    const affixNode = rootRef.current;
    if (!affixNode || !currentTarget) {
      return;
    }

    const targetRect = getTargetRect(currentTarget);
    const affixRect = affixNode.getBoundingClientRect();
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
  const handleSizeChange = React.useMemo(() => {
    return throttleByAnimationFrame(() => {
      setPlaceholderStyle(undefined);
      setAffixStyle(undefined);
      setStatus(AffixStatus.PREPARE);
    });
  }, []);

  const handleEventEmit = React.useMemo(() => {
    return throttleByAnimationFrame(() => {
      setStatus(AffixStatus.PREPARE);
    });
  }, []);

  React.useEffect(() => {
    const node = rootRef.current;
    if (!node) {
      return;
    }
    node.handleEventEmit = handleEventEmit;
    node.handleSizeChange = handleSizeChange;
  }, [handleEventEmit, handleSizeChange]);

  React.useEffect(() => {
    return () => {
      handleSizeChange.cancel?.();
    };
  }, [handleSizeChange]);

  React.useEffect(() => {
    return () => {
      handleEventEmit.cancel?.();
    };
  }, [handleEventEmit]);

  // 保证同步更新，避免闪烁
  useLayoutEffect(() => {
    if (status === AffixStatus.PREPARE) {
      setStatus(AffixStatus.NONE);
      measure();
    }
  }, [status, measure]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const nextTarget = typeof target === 'function' ? target() : target;

    if (currentTarget === nextTarget) {
      return;
    }
    setCurrentTarget(nextTarget);
  });

  React.useEffect(() => {
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
    rootClassName,
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
            className={`${rootClassName}__placeholder`}
            style={placeholderStyle}
            aria-hidden={true}
          />
        )}
        <div style={affixStyle} className={`${rootClassName}__inner`}>
          <ResizeObserver onResizeObserver={handleSizeChange}>{children}</ResizeObserver>
        </div>
      </AffixRoot>
    </ResizeObserver>
  );
});

if (!env.isProduction) {
  Affix.displayName = displayName;
  Affix.propTypes = {
    target: PropTypes.oneOfType([
      PropTypes.func,
      ...(env.isServer
        ? [PropTypes.any]
        : [PropTypes.instanceOf(Window), PropTypes.instanceOf(HTMLElement)]),
    ]),
    onChange: PropTypes.func,
    offsetBottom: PropTypes.number,
    offsetTop: PropTypes.number,
    children: PropTypes.node,
    className: PropTypes.string,
  };
}

export default Affix;
