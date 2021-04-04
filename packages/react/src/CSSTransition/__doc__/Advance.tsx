import React from 'react';
import { Button, CSSTransition, styled } from '@xl-vision/react';

const Div = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #fff;
  font-size: 3rem;
  background-color: #007bff;

  margin-top: 16px;

  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 2s ease;
    overflow: hidden;
  }

  &.slide-enter-from,
  &.slide-leave-to {
    height: 0;
  }
`;

export default () => {
  const [show, setShow] = React.useState(false);

  const [display, setDisplay] = React.useState(false);

  const beforeEnter = React.useCallback(() => {
    setDisplay(true);
  }, []);

  const afterLeave = React.useCallback(() => {
    setDisplay(false);
  }, []);

  return (
    <div>
      <Button theme='primary' onClick={() => setShow(!show)}>
        Click
      </Button>
      <CSSTransition
        in={show}
        transitionClasses='slide'
        mountOnEnter={true}
        beforeEnter={beforeEnter}
        afterLeave={afterLeave}
      >
        <Div style={{ display: display ? '' : 'none' }}>DEMO</Div>
      </CSSTransition>
    </div>
  );
};
