import { env } from '@xl-vision/utils';
import React from 'react';
import PropTypes from 'prop-types';
import { useConstantFn, useForkRef } from '@xl-vision/hooks';
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
  offsetButtom?: number;
  onChange?: (affixed?: boolean) => void;
};

const displayName = 'Affix';

const AffixRoot = styled('div')(({ theme }) => {
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

const Affix = React.forwardRef<HTMLDivElement, AffixProps>((props, ref) => {
  const { clsPrefix } = useTheme();

  const {
    target = getDefaultTarget,
    onChange,
    offsetButtom,
    offsetTop,
    className,
    children,
    ...others
  } = props;

  const [affixStyle, setAffixStyle] = React.useState<React.CSSProperties>();
  const [placeholderStyle, setPlaceholderStyle] = React.useState<React.CSSProperties>();

  const rootRef = React.useRef<HTMLDivElement>(null);

  const forkRef = useForkRef(ref, rootRef);

  const [currentTarget, setCurrentTarget] = React.useState<Window | HTMLElement>();

  const [isAffixed, setAffixed] = React.useState<boolean>();

  const [status, setStatus] = React.useState(AffixStatus.NONE);

  const getTarget = useConstantFn(() => {
    if (typeof target === 'function') {
      return target();
    }
    return target;
  });

  // 当尺寸信息发生变化时，需要清空样式重新计算
  const handleResizeChange = useConstantFn(
    throttleByAnimationFrame(() => {
      setPlaceholderStyle(undefined);
      setAffixStyle(undefined);
      setStatus(AffixStatus.PREPARE);
    }),
  );

  const measure = useConstantFn(() => {
    const affixNode = rootRef.current;
    if (!affixNode || !currentTarget) {
      return;
    }

    const targetRect = getTargetRect(currentTarget);
    const affixRect = affixNode.getBoundingClientRect();
    const top = getFixedTop(affixRect, targetRect, offsetTop);
    const bottom = getFixedBottom(affixRect, targetRect, offsetButtom);

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

  React.useEffect(() => {
    if (status === AffixStatus.PREPARE) {
      measure();
      setStatus(AffixStatus.NONE);
    }
  }, [status, measure]);

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

    const throttleMeasure = throttleByAnimationFrame(measure);

    addTargetObserver(currentTarget, throttleMeasure);
    return () => {
      removeTargetObserver(currentTarget, throttleMeasure);
    };
  }, [currentTarget, measure]);

  const rootClassName = `${clsPrefix}-affix`;

  const classes = clsx(rootClassName, className);

  return (
    <AffixRoot {...others} className={classes} ref={forkRef}>
      {placeholderStyle && (
        <div
          className={`${rootClassName}__placeholder`}
          style={placeholderStyle}
          aria-hidden={true}
        />
      )}
      <div style={affixStyle} className={`${rootClassName}__inner`}>
        <ResizeObserver onResizeObserver={handleResizeChange}>{children}</ResizeObserver>
      </div>
    </AffixRoot>
  );
});

if (!env.isProduction) {
  Affix.displayName = displayName;
  Affix.propTypes = {
    target: PropTypes.func,
    onChange: PropTypes.func,
    offsetButtom: PropTypes.number,
    offsetTop: PropTypes.number,
    children: PropTypes.node,
    className: PropTypes.string,
  };
}

export default Affix;
