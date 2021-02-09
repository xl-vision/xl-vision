import React from 'react';
import { CollapseTransition, styled } from '@xl-vision/react';

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
    opacity: 0;
  }

  &.slide-enter-to,
  &.slide-leave {
    opacity: 1;
  }
`;

export default () => {
  const [active, setActive] = React.useState(false);

  return (
    <div className='wrapper'>
      <button
        onClick={() => {
          setActive(!active);
        }}
      >
        Click
      </button>
      <CollapseTransition in={active} transitionClasses='slide'>
        <Div>DEMO</Div>
      </CollapseTransition>
    </div>
  );
};
