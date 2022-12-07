import { useState } from 'react';
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
  &.slide-exit-active {
    transition: all 2s ease;
  }

  &.slide-enter-from,
  &.slide-exit-to {
    opacity: 0;
  }

  &.slide-enter-to,
  &.slide-exit-from {
    opacity: 1;
  }
`;

const Horizontal = () => {
  const [active, setActive] = useState(false);

  return (
    <div className='wrapper'>
      <Button
        color='primary'
        onClick={() => {
          setActive(!active);
        }}
      >
        Click
      </Button>
      <CollapseTransition horizontal={true} in={active} transitionClassName='slide'>
        <Div>DEMO</Div>
      </CollapseTransition>
    </div>
  );
};

export default Horizontal;
