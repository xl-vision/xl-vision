import { useConstantFn } from '@xl-vision/hooks';
import { keyframes } from '@xl-vision/styled-engine';
import { getBoundingClientRect, isProduction } from '@xl-vision/utils';
import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import {
  HTMLAttributes,
  forwardRef,
  useState,
  ReactElement,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
  CSSProperties,
  SyntheticEvent,
  TouchEvent,
} from 'react';
import { styled } from '../styles';
import { useTheme } from '../ThemeProvider';
import TransitionGroup, { TransitionGroupClassName } from '../TransitionGroup';

export type RippleProps = HTMLAttributes<HTMLDivElement> & {
  transitionClassName: TransitionGroupClassName;
  exitAfterEnter?: boolean;
};

export type RippleRef = {
  start: (e?: SyntheticEvent | { pulsate?: boolean }) => void;
  stop: () => void;
};

const displayName = 'Ripple';

const pulsateKeyframe = keyframes`
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(0.8);
  }
`;

const RipperRoot = styled('div', {
  name: displayName,
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

const RippleInner = styled('div', {
  name: displayName,
  slot: 'Inner',
})`
  position: absolute;
  background-color: currentColor;
  border-radius: 50%;
  &.${({ theme: { clsPrefix } }) => `${clsPrefix}-ripple--pulsate`} {
    animation-name: ${pulsateKeyframe};
    animation-duration: 2.5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
`;

const DELAY_RIPPLE = 80;

const Ripple = forwardRef<RippleRef, RippleProps>((props, ref) => {
  const { transitionClassName, exitAfterEnter, ...others } = props;

  const { clsPrefix } = useTheme();

  const [ripples, setRipples] = useState<Array<ReactElement>>([]);

  // 等待出场动画计数器
  const waitLeaveCountRef = useRef(0);
  // 已经完成进场动画计数器
  const enteredCountRef = useRef(0);
  // key
  const keyRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimerRef = useRef<NodeJS.Timeout>();
  const startTimerCommitRef = useRef<() => void>();
  const ignoreMouseDonwRef = useRef(false);

  const [pulsateRipple, setPulsateRipple] = useState<ReactElement>();

  useEffect(() => {
    return () => {
      if (startTimerRef.current) {
        clearTimeout(startTimerRef.current);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    start,
    stop,
  }));

  const commit = useCallback(
    (x: number, y: number, size: number, pulsate?: boolean) => {
      const key = keyRef.current;
      const style: CSSProperties = {
        width: size,
        height: size,
        top: -size / 2 + y,
        left: -size / 2 + x,
      };

      const classes = clsx({
        [`${clsPrefix}-ripple--pulsate`]: pulsate,
      });

      const ripple = <RippleInner className={classes} key={key} style={style} />;

      if (pulsate) {
        setPulsateRipple(ripple);
      } else {
        setPulsateRipple(undefined);
        setRipples((prev) => [...prev, ripple]);
      }

      keyRef.current++;
    },
    [clsPrefix],
  );

  const start = useCallback(
    (e: SyntheticEvent | { pulsate?: boolean } = {}) => {
      if ((e as MouseEvent).type === 'mousedown' && ignoreMouseDonwRef.current) {
        ignoreMouseDonwRef.current = false;
        return;
      }

      if ((e as TouchEvent).type === 'touchstart') {
        ignoreMouseDonwRef.current = true;
      }

      if (startTimerRef.current) {
        clearTimeout(startTimerRef.current);
        startTimerRef.current = undefined;
      }

      const el = (e as UIEvent).currentTarget
        ? ((e as UIEvent).currentTarget as HTMLElement)
        : containerRef.current;
      const rect = el
        ? getBoundingClientRect(el)
        : {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
          };

      const clientWidth = el ? el.clientWidth : 0;
      const clientHeight = el ? el.clientHeight : 0;

      const { clientX, clientY } = (e as TouchEvent<HTMLDivElement>).touches
        ? (e as TouchEvent).touches[0]
        : (e as MouseEvent);
      const x = Math.round(typeof clientX === 'undefined' ? clientWidth / 2 : clientX - rect.left);
      const y = Math.round(typeof clientY === 'undefined' ? clientHeight / 2 : clientY - rect.top);

      const sizeX = Math.max(Math.abs(clientWidth - x), x) * 2 + 2;
      const sizeY = Math.max(Math.abs(clientHeight - y), y) * 2 + 2;
      const size = Math.round(Math.sqrt(sizeX ** 2 + sizeY ** 2));

      if ((e as TouchEvent).touches) {
        // check that this isn't another touchstart due to multitouch
        // otherwise we will only clear a single timer when unmounting while two
        // are running
        startTimerCommitRef.current = () => {
          commit(x, y, size);
        };
        startTimerRef.current = setTimeout(() => {
          if (startTimerCommitRef.current) {
            startTimerCommitRef.current();
            startTimerCommitRef.current = undefined;
          }
        }, DELAY_RIPPLE);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        commit(x, y, size, (e as any).pulsate);
      }
    },
    [commit],
  );

  const stop = useConstantFn(() => {
    setPulsateRipple(undefined);
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current);
      startTimerRef.current = undefined;
      if (startTimerCommitRef.current) {
        startTimerCommitRef.current();
        startTimerCommitRef.current = undefined;
      }
    }
    if (exitAfterEnter) {
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

  const handleEnter = useConstantFn(() => {
    if (exitAfterEnter) {
      if (waitLeaveCountRef.current > 0) {
        waitLeaveCountRef.current--;
        setRipples((prev) => prev.slice(1));
        return;
      }
      enteredCountRef.current++;
    }
  });

  return (
    <RipperRoot {...others} ref={containerRef}>
      {pulsateRipple}

      <TransitionGroup transitionClassName={transitionClassName} onEntered={handleEnter}>
        {ripples}
      </TransitionGroup>
    </RipperRoot>
  );
});

if (!isProduction) {
  Ripple.displayName = displayName;

  Ripple.propTypes = {
    transitionClassName: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    className: PropTypes.string,
    exitAfterEnter: PropTypes.bool,
  };
}

export default Ripple;
