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
      '&-enter-active, &-exit-active': {
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
      '&-enter-from,&-exit-to': {
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

const Basic = () => {
  return (
    <Wrapper>
      <div className='column'>
        <div />
        <PopperRoot transitionClassName='slide' placement='top-start' popup={popup} flip={false}>
          <Button color='primary'>TS</Button>
        </PopperRoot>
        <PopperRoot transitionClassName='slide' placement='top' popup={popup} flip={false}>
          <Button color='primary'>T</Button>
        </PopperRoot>
        <PopperRoot transitionClassName='slide' placement='top-end' popup={popup} flip={false}>
          <Button color='primary'>TE</Button>
        </PopperRoot>
        <div />
      </div>
      <div className='column'>
        <PopperRoot transitionClassName='slide' placement='left-start' popup={popup} flip={false}>
          <Button color='primary'>LS</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot transitionClassName='slide' placement='right-start' popup={popup} flip={false}>
          <Button color='primary'>RS</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <PopperRoot transitionClassName='slide' placement='left' popup={popup} flip={false}>
          <Button color='primary'>L</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot transitionClassName='slide' placement='right' popup={popup} flip={false}>
          <Button color='primary'>R</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <PopperRoot transitionClassName='slide' placement='left-end' popup={popup} flip={false}>
          <Button color='primary'>LE</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot transitionClassName='slide' placement='right-end' popup={popup} flip={false}>
          <Button color='primary'>RE</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <div />
        <PopperRoot transitionClassName='slide' placement='bottom-start' popup={popup} flip={false}>
          <Button color='primary'>BS</Button>
        </PopperRoot>
        <PopperRoot transitionClassName='slide' placement='bottom' popup={popup} flip={false}>
          <Button color='primary'>B</Button>
        </PopperRoot>
        <PopperRoot transitionClassName='slide' placement='bottom-end' popup={popup} flip={false}>
          <Button color='primary'>BE</Button>
        </PopperRoot>
        <div />
      </div>
    </Wrapper>
  );
};

export default Basic;
