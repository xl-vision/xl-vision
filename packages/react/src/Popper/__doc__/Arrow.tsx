import { Popper, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(() => {
  return {
    button: {
      marginRight: '16px',
      marginBottom: '16px',
    },
  };
});

const PopperRoot = styled(Popper)(({ theme }) => {
  return {
    '.popup': {
      borderRadius: '3px',
      backgroundColor: theme.color.grey[300],
      // padding: '5px 10px',
      lineHeight: 1,
      // ...theme.elevations(5),
    },
    '.arrow': {
      width: 8,
      height: 8,
      // transform: 'translate(-4px, -4px)',
      background: 'red',
    },
    '.slide': {
      '&-enter-active, &-exit-active': {
        transition: theme.transition.standard('all'),
        '&[data-placement^="top"]': {
          transformOrigin: '0 100%',
        },
        '&[data-placement^="bottom"]': {
          transformOrigin: '0 0',
        },
      },
      '&-enter-from,&-exit-to': {
        transform: 'scaleY(0)',
      },
      '&-enter-to,&-exit-from': {
        transform: 'scaleY(1)',
      },
    },
  };
});

const popup = <span className='popup'>This is popper</span>;

const Arrow = () => {
  return (
    <Wrapper>
      <PopperRoot
        transitionClassName='slide'
        placement='top'
        popup={popup}
        arrow={<div className='arrow' />}
        offset={10}
      >
        <Button color='primary'>hover</Button>
      </PopperRoot>
    </Wrapper>
  );
};

export default Arrow;
