import React from 'react';
import { Popper, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(({ theme }) => {
  return {
    button: {
      marginRight: '16px',
      marginBottom: '16px',
    },
    '.popup': {
      borderRadius: '3px',
      backgroundColor: theme.color.grey[300],
      padding: '5px 10px',
      ...theme.elevations(5),
    },
    '.arrow': {
      position: 'absolute',
      left: '0px',
      bottom: '-2px',
      '&::before': {
        position: 'absolute',
        display: 'block',
        boxSizing: 'border-box',
        content: '""',
        width: '10px',
        height: '10px',
        transform: 'rotate(45deg)',
        zIndex: -1,
        left: '-5px',
        bottom: '-5px',
        backgroundColor: theme.color.grey[300],
      },
    },
    '.slide': {
      '&-enter-active, &-leave-active': {
        transition: theme.transition.standard('transform'),
      },
      '&-enter,&-leave-to': {
        '&[data-placement^="top"]': {
          transform: 'scaleY(0)',
        },
        '&[data-placement^="bottom"]': {
          transform: 'scaleY(0)',
        },
      },
      '&-enter-to,&-leave': {
        '&[data-placement^="top"]': {
          transform: 'scaleY(1)',
        },
        '&[data-placement^="bottom"]': {
          transform: 'scaleY(1)',
        },
      },
    },
  };
});

const popup = <span className='popup'>This is popper</span>;

export default () => {
  return (
    <Wrapper>
      <Popper
        transitionClasses='slide'
        placement='top'
        popup={popup}
        arrow={<div className='arrow' />}
        offset={10}
      >
        <Button theme='primary'>hover</Button>
      </Popper>
    </Wrapper>
  );
};
