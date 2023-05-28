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
  const { colors } = theme;

  return {
    '.popup': {
      borderRadius: '3px',
      backgroundColor: colors.background.spotlight,
      color: colors.getContrastText(colors.background.spotlight).primary,
      padding: '5px 10px',
      boxShadow: theme.elevations[3],
    },
    '.arrow': {
      width: 8,
      height: 8,
      transform: 'translate(-4px, -4px) rotate(45deg)',
      backgroundColor: colors.background.spotlight,
    },
    '.slide': {
      '&-enter-active, &-exit-active': {
        transition: theme.transitions.enter('transform'),
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

const popup = <div className='popup'>This is popper</div>;

const Arrow = () => {
  return (
    <Wrapper>
      <PopperRoot
        arrow={<div className='arrow' />}
        offset={10}
        placement='right'
        popup={popup}
        transitionClassName='slide'
      >
        <Button color='primary'>hover</Button>
      </PopperRoot>
    </Wrapper>
  );
};

export default Arrow;
