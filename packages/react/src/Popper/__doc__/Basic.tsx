import React from 'react';
import { Popper, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(({ theme }) => {
  return {
    '.slide': {
      '&-enter, &-leave': {
        // transformOrigin: '0 0',
      },
      '&-enter-active, &-leave-active': {
        transition: theme.transition.standard('all'),
        transform: 'scaleY(1)',
      },
      '&-enter,&-leave-to': {
        transform: 'scaleY(0)',
      },
    },
  };
});

export default () => {
  return (
    <Wrapper>
      <Popper
        transitionClasses='slide'
        placement='left'
        popup={<span className='popper_popup'>This is popper</span>}
      >
        <Button>left</Button>
      </Popper>
    </Wrapper>
  );
};
