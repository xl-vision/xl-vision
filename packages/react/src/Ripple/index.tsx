import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ThemeContext } from '../ThemeProvider';
import TransitionGroup, { TransitionGroupClasses } from '../TransitionGroup';
import useEventCallback from '../hooks/useEventCallback';
import { styled } from '../styles';

export interface RippleProps extends React.HTMLAttributes<HTMLDivElement> {
  transitionClasses?: TransitionGroupClasses;
  leaveAfterEnter?: boolean;
}

export interface RippleRef {
  start: (e?: any) => void;
  stop: () => void;
}

const RipperRoot = styled('div', {
  name: 'Ripple',
  slot: 'Root',
})(() => {
  return {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    overflow: 'hidden',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  };
});

const RippleInner = styled('div')(() => {
  return {
    position: 'absolute',
    backgroundColor: 'currentcolor',
    borderRadius: '50%',
  };
});

const DELAY_RIPPLE = 80;

const Ripple = React.forwardRef<RippleRef, RippleProps>((props, ref) => {
  const { transitionClasses, leaveAfterEnter, className, ...others } = props;

  const { clsPrefix } = React.useContext(ThemeContext);

  const [ripples, setRipples] = React.useState<Array<React.ReactElement>>([]);

  // 等待出场动画计数器
  const waitLeaveCountRef = React.useRef(0);
  // 已经完成进场动画计数器
  const enteredCountRef = React.useRef(0);
  // key
  const keyRef = React.useRef(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const startTimerRef = React.useRef<NodeJS.Timeout>();
  const ignoreMouseDonwRef = React.useRef(false);

  React.useEffect(() => {
    return () => {
      if (startTimerRef.current) {
        clearTimeout(startTimerRef.current);
      }
    };
  }, []);

  React.useImperativeHandle(ref, () => ({
    start,
    stop,
  }));

  const commit = React.useCallback(
    (x: number, y: number, size: number) => {
      const key = keyRef.current;
      const style: React.CSSProperties = {
        width: size,
        height: size,
        top: -size / 2 + y,
        left: -size / 2 + x,
      };
      const ripple = (
        <RippleInner className={clsx(`${clsPrefix}-ripple-inner`)} key={key} style={style} />
      );
      setRipples((prev) => [...prev, ripple]);
      keyRef.current++;
    },
    [clsPrefix],
  );

  const start = React.useCallback(
    (e: React.SyntheticEvent | object = {}) => {
      if (startTimerRef.current) {
        clearTimeout(startTimerRef.current);
        startTimerRef.current = undefined;
      }

      if ((e as React.MouseEvent).type === 'mousedown' && ignoreMouseDonwRef.current) {
        ignoreMouseDonwRef.current = false;
        return;
      }

      if ((e as React.TouchEvent).type === 'touchstart') {
        ignoreMouseDonwRef.current = true;
      }
      const el = (e as React.UIEvent).currentTarget
        ? ((e as React.UIEvent).currentTarget as HTMLElement)
        : containerRef.current;
      const rect = el
        ? el.getBoundingClientRect()
        : {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
          };

      const clientWidth = el ? el.clientWidth : 0;
      const clientHeight = el ? el.clientHeight : 0;

      const { clientX, clientY } = (e as React.TouchEvent<HTMLDivElement>).touches
        ? (e as TouchEvent).touches[0]
        : (e as MouseEvent);
      const x = Math.round(typeof clientX === 'undefined' ? clientWidth / 2 : clientX - rect.left);
      const y = Math.round(typeof clientY === 'undefined' ? clientHeight / 2 : clientY - rect.top);
      const sizeX = Math.max(Math.abs(clientWidth - x), x) * 2 + 2;
      const sizeY = Math.max(Math.abs(clientHeight - y), y) * 2 + 2;
      const size = Math.round(Math.sqrt(sizeX ** 2 + sizeY ** 2));

      if ((e as React.TouchEvent).touches) {
        startTimerRef.current = setTimeout(() => {
          commit(x, y, size);
        }, DELAY_RIPPLE);
      } else {
        commit(x, y, size);
      }
    },
    [commit],
  );

  const stop = useEventCallback(() => {
    if (leaveAfterEnter) {
      if (enteredCountRef.current > 0) {
        enteredCountRef.current--;
        setRipples((prev) => prev.slice(1));
        return;
      }
      if (ripples.length > 0) {
        waitLeaveCountRef.current++;
      }
    } else {
      setRipples((prev) => {
        if (prev.length > 0) {
          return prev.slice(1);
        }
        return prev;
      });
    }
  });

  const afterEnter = useEventCallback(() => {
    if (leaveAfterEnter) {
      if (waitLeaveCountRef.current > 0) {
        waitLeaveCountRef.current--;
        setRipples((prev) => prev.slice(1));
        return;
      }
      enteredCountRef.current++;
    }
  });

  const classes = clsx(`${clsPrefix}-ripple-root`, className);

  return (
    <RipperRoot {...others} className={classes} ref={containerRef}>
      <TransitionGroup transitionClasses={transitionClasses} afterEnter={afterEnter}>
        {ripples}
      </TransitionGroup>
    </RipperRoot>
  );
});

Ripple.displayName = 'Ripple';

Ripple.propTypes = {
  transitionClasses: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  leaveAfterEnter: PropTypes.bool,
  className: PropTypes.string,
};

export default Ripple;
