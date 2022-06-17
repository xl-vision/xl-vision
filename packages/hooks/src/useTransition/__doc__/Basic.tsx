import React from 'react';
import { useTransition, TransitionStartHook, TransitionStartingHook } from '@xl-vision/hooks';
import { Button, styled } from '@xl-vision/react';
import { gsap } from 'gsap';

const Box = styled('div')(({ theme }) => {
  return {
    width: 30,
    height: 30,
    borderRadius: '50%',
    marginTop: 20,
    backgroundColor: theme.color.themes.secondary.color,
  };
});

const Demo = () => {
  const [inOption, setInOption] = React.useState(false);

  const handleEnter: TransitionStartHook = React.useCallback((el) => {
    console.log(el);
    gsap.set(el, {
      scaleX: 0.25,
      scaleY: 0.25,
      opacity: 1,
    });
  }, []);

  const handleEntering: TransitionStartingHook = React.useCallback((el, done) => {
    gsap.to(el, {
      duration: 1,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      ease: 'elastic.inOut(2.5, 1)',
      onComplete: done,
    });
  }, []);

  const handleExiting: TransitionStartingHook = React.useCallback((el, done) => {
    gsap.to(el, {
      duration: 0.7,
      scaleX: 1,
      scaleY: 1,
      x: 300,
      ease: 'elastic.inOut(2.5, 1)',
    });
    gsap.to(el, {
      duration: 0.2,
      delay: 0.5,
      opacity: 0,
      onComplete: done,
    });
  }, []);

  const { nodeRef, show } = useTransition({
    in: inOption,
    onEnter: handleEnter,
    onEntering: handleEntering,
    onExiting: handleExiting,
  });

  return (
    <div>
      <Button color='primary' onClick={() => setInOption((prev) => !prev)}>
        click
      </Button>
      {show && <Box ref={nodeRef} />}
    </div>
  );
};

export default Demo;
