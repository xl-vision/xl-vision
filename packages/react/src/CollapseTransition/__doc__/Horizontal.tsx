import React from 'react';
import { Button, CollapseTransition, styled } from '@xl-vision/react';

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

  &.slide-enter-from,
  &.slide-leave-to {
    opacity: 0;
  }

  &.slide-enter-to,
  &.slide-leave-from {
    opacity: 1;
  }
`;

export default () => {
  const [active, setActive] = React.useState(false);

  return (
    <div className='wrapper'>
      <Button
        theme='primary'
        onClick={() => {
          setActive(!active);
        }}
      >
        Click
      </Button>
      <CollapseTransition in={active} horizontal={true} transitionClasses='slide'>
        <Div>DEMO</Div>
      </CollapseTransition>
    </div>
  );
};
