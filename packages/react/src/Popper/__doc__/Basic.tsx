import React from 'react';
import { Popper, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(({ theme }) => {
  return {
    margin: '0 100px',
    '.column': {
      display: 'flex',
      justifyContent: 'space-between',
      ':not(:last-child)': {
        marginBottom: '10px',
      },
    },
    '.slide': {
      '&-enter-active, &-leave-active': {
        transition: theme.transition.standard('transform'),
        '&[data-placement^="left"]': {
          transformOrigin: '100% 0',
        },
        '&[data-placement^="right"]': {
          transformOrigin: '0 0',
        },
        '&[data-placement^="top"]': {
          transformOrigin: '0 100%',
        },
        '&[data-placement^="bottom"]': {
          transformOrigin: '0 0',
        },
      },
      '&-enter,&-leave-to': {
        '&[data-placement^="left"]': {
          transform: 'scaleX(0)',
        },
        '&[data-placement^="right"]': {
          transform: 'scaleX(0)',
        },
        '&[data-placement^="top"]': {
          transform: 'scaleY(0)',
        },
        '&[data-placement^="bottom"]': {
          transform: 'scaleY(0)',
        },
      },
      '&-enter-to,&-leave': {
        '&[data-placement^="left"]': {
          transform: 'scaleX(1)',
        },
        '&[data-placement^="right"]': {
          transform: 'scaleX(1)',
        },
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

const popup = <span>This is popper</span>;

export default () => {
  return (
    <Wrapper>
      <div className='column'>
        <div />
        <Popper transitionClasses='slide' placement='top-start' popup={popup}>
          <Button>top start</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='top' popup={popup}>
          <Button>top</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='top-end' popup={popup}>
          <Button>top end</Button>
        </Popper>
        <div />
      </div>
      <div className='column'>
        <Popper transitionClasses='slide' placement='left-start' popup={popup}>
          <Button>left start</Button>
        </Popper>
        <div />
        <div />
        <div />
        <Popper transitionClasses='slide' placement='right-start' popup={popup}>
          <Button>right start</Button>
        </Popper>
      </div>
      <div className='column'>
        <Popper transitionClasses='slide' placement='left' popup={popup}>
          <Button>left</Button>
        </Popper>
        <div />
        <div />
        <div />
        <Popper transitionClasses='slide' placement='right' popup={popup}>
          <Button>right</Button>
        </Popper>
      </div>
      <div className='column'>
        <Popper transitionClasses='slide' placement='left-end' popup={popup}>
          <Button>left end</Button>
        </Popper>
        <div />
        <div />
        <div />
        <Popper transitionClasses='slide' placement='right-end' popup={popup}>
          <Button>right end</Button>
        </Popper>
      </div>
      <div className='column'>
        <div />
        <Popper transitionClasses='slide' placement='bottom-start' popup={popup}>
          <Button>bottom start</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='bottom' popup={popup}>
          <Button>bottom</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='bottom-end' popup={popup}>
          <Button>bottom end</Button>
        </Popper>
        <div />
      </div>
    </Wrapper>
  );
};
