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
      '&-top': {
        '&-enter-active, &-exit-active': {
          transform: 'scaleY(1)',
          transition: theme.transition.standard('transform', '10s'),
          transformOrigin: '0 100%',
        },
        '&-enter-from,&-exit-to': {
          transform: 'scaleY(0)',
        },
      },
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
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='top-start'
          popup={popup}
          flip={false}
          unmountOnHide={false}
        >
          <Button color='primary'>TS</Button>
        </PopperRoot>
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='top'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>T</Button>
        </PopperRoot>
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='top-end'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>TE</Button>
        </PopperRoot>
        <div />
      </div>
      <div className='column'>
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='left-start'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>LS</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='right-start'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>RS</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='left'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>L</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='right'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>R</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='left-end'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>LE</Button>
        </PopperRoot>
        <div />
        <div />
        <div />
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='right-end'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>RE</Button>
        </PopperRoot>
      </div>
      <div className='column'>
        <div />
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='bottom-start'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>BS</Button>
        </PopperRoot>
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='bottom'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>B</Button>
        </PopperRoot>
        <PopperRoot
          transitionClassName={(placement) => `slide-${placement.split('-')[0]}`}
          placement='bottom-end'
          popup={popup}
          flip={false}
        >
          <Button color='primary'>BE</Button>
        </PopperRoot>
        <div />
      </div>
    </Wrapper>
  );
};

export default Basic;
