import React from 'react';
import { Popper, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(({ theme }) => {
  return {
    padding: '0 20px',
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

const popup = <span>content</span>;

export default () => {
  return (
    <Wrapper>
      <div className='column'>
        <div />
        <Popper transitionClasses='slide' placement='top-start' popup={popup}>
          <Button>TS</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='top' popup={popup}>
          <Button>T</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='top-end' popup={popup}>
          <Button>TE</Button>
        </Popper>
        <div />
      </div>
      <div className='column'>
        <Popper transitionClasses='slide' placement='left-start' popup={popup}>
          <Button>LS</Button>
        </Popper>
        <div />
        <div />
        <div />
        <Popper transitionClasses='slide' placement='right-start' popup={popup}>
          <Button>RS</Button>
        </Popper>
      </div>
      <div className='column'>
        <Popper transitionClasses='slide' placement='left' popup={popup}>
          <Button>L</Button>
        </Popper>
        <div />
        <div />
        <div />
        <Popper transitionClasses='slide' placement='right' popup={popup}>
          <Button>R</Button>
        </Popper>
      </div>
      <div className='column'>
        <Popper transitionClasses='slide' placement='left-end' popup={popup}>
          <Button>LE</Button>
        </Popper>
        <div />
        <div />
        <div />
        <Popper transitionClasses='slide' placement='right-end' popup={popup}>
          <Button>RE</Button>
        </Popper>
      </div>
      <div className='column'>
        <div />
        <Popper transitionClasses='slide' placement='bottom-start' popup={popup}>
          <Button>BS</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='bottom' popup={popup}>
          <Button>B</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='bottom-end' popup={popup}>
          <Button>BE</Button>
        </Popper>
        <div />
      </div>
    </Wrapper>
  );
};
