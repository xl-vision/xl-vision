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
          transformOrigin: '100% 0',
        },
        '&[data-placement^="right"]': {
          transform: 'scaleX(1)',
          transformOrigin: '0 0',
        },
        '&[data-placement^="top"]': {
          transform: 'scaleY(1)',
          transformOrigin: '0 100%',
        },
        '&[data-placement^="bottom"]': {
          transform: 'scaleY(1)',
          transformOrigin: '0 0',
        },
      },

      '&-enter-from, &-exit-to': {
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
        <PopperRoot
          autoPlacementOptions={false}
          placement='top-start'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>TS</Button>
        </PopperRoot>
        <PopperRoot
          autoPlacementOptions={false}
          placement='top'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>T</Button>
        </PopperRoot>
        <PopperRoot
          autoPlacementOptions={false}
          placement='top-end'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>TE</Button>
        </PopperRoot>
        <div />
      </div>
      <div className='column'>
        <PopperRoot
          autoPlacementOptions={false}
          placement='left-start'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>LS</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot
          autoPlacementOptions={false}
          placement='right-start'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>RS</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <PopperRoot
          autoPlacementOptions={false}
          placement='left'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>L</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot
          autoPlacementOptions={false}
          placement='right'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>R</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <PopperRoot
          autoPlacementOptions={false}
          placement='left-end'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>LE</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot
          autoPlacementOptions={false}
          placement='right-end'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>RE</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <div />
        <PopperRoot
          autoPlacementOptions={false}
          placement='bottom-start'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>BS</Button>
        </PopperRoot>
        <PopperRoot
          autoPlacementOptions={false}
          placement='bottom'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>B</Button>
        </PopperRoot>
        <PopperRoot
          autoPlacementOptions={false}
          placement='bottom-end'
          popup={popup}
          transitionClassName='slide'
        >
          <Button color='primary'>BE</Button>
        </PopperRoot>
        <div />
      </div>
    </Wrapper>
  );
};

export default Basic;
