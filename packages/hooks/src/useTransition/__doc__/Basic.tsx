import React from 'react';
import {
  useTransition,
  TransitionStartHook,
  TransitionStartingHook,
  TransitionEndHook,
} from '@xl-vision/hooks';
import { Button } from '@xl-vision/react';

type State = 'enter' | 'entering' | 'entered' | 'leave' | 'leaving' | 'leaved';

const Demo = () => {
  const [show, setShow] = React.useState(false);

  const [state, setState] = React.useState<State>(show ? 'entered' : 'leaved');

  const handleEnter: TransitionStartHook = React.useCallback(() => {
    setState('enter');
  }, []);

  const handleEntering: TransitionStartingHook = React.useCallback((_1, done, _2, isCancelled) => {
    setTimeout(() => {
      if (!isCancelled()) {
        setState('entering');
        done();
      }
    }, 1000);
  }, []);

  const handleEntered: TransitionEndHook = React.useCallback(() => {
    setState('entered');
  }, []);

  const handleLeave: TransitionStartHook = React.useCallback(() => {
    setState('leave');
  }, []);

  const handleLeaving: TransitionStartingHook = React.useCallback((_1, done, _2, isCancelled) => {
    setTimeout(() => {
      if (!isCancelled()) {
        setState('leaving');
        done();
      }
    }, 1000);
  }, []);

  const handleLeaved: TransitionEndHook = React.useCallback(() => {
    setState('leaved');
  }, []);

  const { nodeRef } = useTransition({
    in: show,
    transitionOnFirst: true,
    onEnter: handleEnter,
    onEntering: handleEntering,
    onEntered: handleEntered,
    onLeave: handleLeave,
    onLeaving: handleLeaving,
    onLeaved: handleLeaved,
  });

  React.useEffect(() => {
    console.log(state);
  }, [state]);

  const defaultStyle = {
    transition: `all .3s ease-in-out`,
    marginTop: 10,
  };

  const transitionStyles: Record<State, React.CSSProperties> = {
    enter: { opacity: 0, transform: `translateX(10px)` },
    entering: { opacity: 1, transform: `translateX(0)` },
    entered: { opacity: 1, transform: `translateX(0)` },
    leave: { opacity: 1, transform: `translateX(0)` },
    leaving: { opacity: 0, transform: `translateX(10px)` },
    leaved: { opacity: 0, transform: `translateX(10px)` },
  };

  return (
    <div>
      <Button color='primary' onClick={() => setShow((prev) => !prev)}>
        click
      </Button>
      <div
        style={{
          ...defaultStyle,
          ...transitionStyles[state],
        }}
        ref={nodeRef}
      >
        hello
      </div>
    </div>
  );
};

export default Demo;
