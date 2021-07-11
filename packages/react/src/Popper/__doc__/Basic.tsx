import React from 'react';
import { Popper, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    '.column': {
      display: 'flex',
      justifyContent: 'space-between',
      ':not(:last-child)': {
        marginBottom: '10px',
      },
    },
  };
});

const PopperRoot = styled(Popper)(({ theme }) => {
  return {
    '.slide': {
      '&-enter-active, &-leave-active': {
        transition: theme.transition.standard('transform'),
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
      '&-enter-from,&-leave-to': {
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
    },
  };
});

const popup = <span>content</span>;

export default () => {
  return (
    <Wrapper>
      <div className='column'>
        <div />
        <PopperRoot transitionClasses='slide' placement='top-start' popup={popup} flip={false}>
          <Button theme='primary'>TS</Button>
        </PopperRoot>
        <PopperRoot transitionClasses='slide' placement='top' popup={popup} flip={false}>
          <Button theme='primary'>T</Button>
        </PopperRoot>
        <PopperRoot transitionClasses='slide' placement='top-end' popup={popup} flip={false}>
          <Button theme='primary'>TE</Button>
        </PopperRoot>
        <div />
      </div>
      <div className='column'>
        <PopperRoot transitionClasses='slide' placement='left-start' popup={popup} flip={false}>
          <Button theme='primary'>LS</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot transitionClasses='slide' placement='right-start' popup={popup} flip={false}>
          <Button theme='primary'>RS</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <PopperRoot transitionClasses='slide' placement='left' popup={popup} flip={false}>
          <Button theme='primary'>L</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot transitionClasses='slide' placement='right' popup={popup} flip={false}>
          <Button theme='primary'>R</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <PopperRoot transitionClasses='slide' placement='left-end' popup={popup} flip={false}>
          <Button theme='primary'>LE</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot transitionClasses='slide' placement='right-end' popup={popup} flip={false}>
          <Button theme='primary'>RE</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <div />
        <PopperRoot transitionClasses='slide' placement='bottom-start' popup={popup} flip={false}>
          <Button theme='primary'>BS</Button>
        </PopperRoot>
        <PopperRoot transitionClasses='slide' placement='bottom' popup={popup} flip={false}>
          <Button theme='primary'>B</Button>
        </PopperRoot>
        <PopperRoot transitionClasses='slide' placement='bottom-end' popup={popup} flip={false}>
          <Button theme='primary'>BE</Button>
        </PopperRoot>
        <div />
      </div>
    </Wrapper>
  );
};
