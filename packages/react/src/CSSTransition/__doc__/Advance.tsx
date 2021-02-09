import React from 'react';
import { CSSTransition, styled } from '@xl-vision/react';

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
  }

  &.slide-enter,
  &.slide-leave-to {
    height: 0;
  }

  &.slide-enter-to,
  &.slide-leave {
    height: 200px;
  }

  &.slide-leave-done {
    display: none;
  }
`;

export default () => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Click</button>
      <CSSTransition in={show} transitionClasses='slide' mountOnEnter={true}>
        <Div>DEMO</Div>
      </CSSTransition>
    </div>
  );
};
