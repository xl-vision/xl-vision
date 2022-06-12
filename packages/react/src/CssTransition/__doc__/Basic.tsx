import React from 'react';
import { Button, CssTransition, styled } from '@xl-vision/react';

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
  &.slide-exit-active {
    transition: all 2s ease;
  }

  &.slide-enter,
  &.slide-exit-to {
    height: 0;
  }
`;

const Basic = () => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <Button color='primary' onClick={() => setShow(!show)}>
        Click
      </Button>
      <CssTransition in={show} transitionClassName='slide' mountOnEnter={true} unmountOnExit={true}>
        <Div>DEMO</Div>
      </CssTransition>
    </div>
  );
};

export default Basic;
