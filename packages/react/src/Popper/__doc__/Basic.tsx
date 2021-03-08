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
          <Button theme='primary'>TS</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='top' popup={popup}>
          <Button theme='primary'>T</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='top-end' popup={popup}>
          <Button theme='primary'>TE</Button>
        </Popper>
        <div />
      </div>
      <div className='column'>
        <Popper transitionClasses='slide' placement='left-start' popup={popup}>
          <Button theme='primary'>LS</Button>
        </Popper>
        <div />
        <div />
        <div />
        <Popper transitionClasses='slide' placement='right-start' popup={popup}>
          <Button theme='primary'>RS</Button>
        </Popper>
      </div>
      <div className='column'>
        <Popper transitionClasses='slide' placement='left' popup={popup}>
          <Button theme='primary'>L</Button>
        </Popper>
        <div />
        <div />
        <div />
        <Popper transitionClasses='slide' placement='right' popup={popup}>
          <Button theme='primary'>R</Button>
        </Popper>
      </div>
      <div className='column'>
        <Popper transitionClasses='slide' placement='left-end' popup={popup}>
          <Button theme='primary'>LE</Button>
        </Popper>
        <div />
        <div />
        <div />
        <Popper transitionClasses='slide' placement='right-end' popup={popup}>
          <Button theme='primary'>RE</Button>
        </Popper>
      </div>
      <div className='column'>
        <div />
        <Popper transitionClasses='slide' placement='bottom-start' popup={popup}>
          <Button theme='primary'>BS</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='bottom' popup={popup}>
          <Button theme='primary'>B</Button>
        </Popper>
        <Popper transitionClasses='slide' placement='bottom-end' popup={popup}>
          <Button theme='primary'>BE</Button>
        </Popper>
        <div />
      </div>
    </Wrapper>
  );
};
