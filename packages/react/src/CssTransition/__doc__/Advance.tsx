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

  margin-top: 16px;

  &.slide-enter-active,
  &.slide-appear-active,
  &.slide-exit-active,
  &.slide-disappear-active {
    transition: all 2s ease;
    overflow: hidden;
  }

  &.slide-enter,
  &.slide-appear,
  &.slide-exit-to,
  &.slide-disappear-to {
    height: 0;
  }
`;

const Advance = () => {
  const [inOption, setInOption] = React.useState(false);

  return (
    <div>
      <Button color='primary' onClick={() => setInOption((prev) => !prev)}>
        Click
      </Button>
      <CssTransition
        in={inOption}
        transitionOnFirst={true}
        transitionClassName='slide'
        mountOnEnter={true}
      >
        {(show) => <Div style={{ display: show ? '' : 'none' }}>DEMO</Div>}
      </CssTransition>
    </div>
  );
};

export default Advance;
