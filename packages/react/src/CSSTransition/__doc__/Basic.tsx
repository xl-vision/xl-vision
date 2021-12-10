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
  overflow: hidden;
  margin-top: 16px;

  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 2s ease;
  }

  &.slide-enter-from,
  &.slide-leave-to {
    height: 0;
  }
`;

export default () => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <Button color='primary' onClick={() => setShow(!show)}>
        Click
      </Button>
      <CSSTransition in={show} transitionClasses='slide' mountOnEnter={true} unmountOnLeave={true}>
        <Div>DEMO</Div>
      </CSSTransition>
    </div>
  );
};
