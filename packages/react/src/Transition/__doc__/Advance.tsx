'use client';

import { useState } from 'react';
import { Button, Transition, styled } from '@xl-vision/react';

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
  &.slide-appear-active,
  &.slide-exit-active,
  &.slide-disappear-active {
    transition: all 2s ease;
    overflow: hidden;
  }

  &.slide-enter-from,
  &.slide-appear-from,
  &.slide-exit-to,
  &.slide-disappear-to {
    height: 0;
  }
`;

const Advance = () => {
  const [inOption, setInOption] = useState(false);

  return (
    <div>
      <Button color='primary' onClick={() => setInOption((prev) => !prev)}>
        Click
      </Button>
      <Transition
        in={inOption}
        mountOnEnter={true}
        transitionClassName='slide'
        transitionOnFirst={true}
      >
        {(show) => <Div style={{ display: show ? '' : 'none' }}>DEMO</Div>}
      </Transition>
    </div>
  );
};

export default Advance;
