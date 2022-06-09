import React from 'react';
import {
  useTransition,
  TransitionStartHook,
  TransitionStartingHook,
  TransitionEndHook,
} from '@xl-vision/hooks';
import { Button } from '@xl-vision/react';

type State = 'enter' | 'entering' | 'entered' | 'exit' | 'exiting' | 'exited';

const Demo = () => {
  const [show, setShow] = React.useState(false);

  const [state, setState] = React.useState<State>(show ? 'entered' : 'exited');

  const handleEnter: TransitionStartHook = React.useCallback(() => {
    setState('enter');
  }, []);

  const handleEntering: TransitionStartingHook = React.useCallback((_1, done) => {
    setTimeout(() => {
      setState('entering');
      setTimeout(() => {
        done();
      });
    });
  }, []);

  const handleEntered: TransitionEndHook = React.useCallback(() => {
    setState('entered');
  }, []);

  const handleExit: TransitionStartHook = React.useCallback(() => {
    setState('exit');
  }, []);

  const handleExiting: TransitionStartingHook = React.useCallback((_1, done) => {
    setTimeout(() => {
      setState('exiting');
      setTimeout(() => {
        done();
      });
    });
  }, []);

  const handleExited: TransitionEndHook = React.useCallback(() => {
    setState('exited');
  }, []);

  const { nodeRef } = useTransition({
    in: show,
    transitionOnFirst: true,
    onEnter: handleEnter,
    onEntering: handleEntering,
    onEntered: handleEntered,
    onExit: handleExit,
    onExiting: handleExiting,
    onExited: handleExited,
  });

  React.useEffect(() => {
    console.log(`state:${state}`);
  }, [state]);

  const defaultStyle = {
    transition: `all 300ms ease-in-out`,
    marginTop: 10,
  };

  const transitionStyles: Record<State, React.CSSProperties> = {
    enter: { opacity: 0, transform: `translateX(10px)` },
    entering: { opacity: 1, transform: `translateX(0)` },
    entered: { opacity: 1, transform: `translateX(0)` },
    exit: { opacity: 1, transform: `translateX(0)` },
    exiting: { opacity: 0, transform: `translateX(10px)` },
    exited: { opacity: 0, transform: `translateX(10px)` },
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
