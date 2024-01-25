'use client';

import { useState, useCallback } from 'react';
import { Popper, Button, styled } from '@xl-vision/react';

const PopperRoot = styled(Popper)(({ theme }) => {
  return {
    '.slide': {
      '&-enter-active, &-exit-active': {
        transition: theme.transitions.standard('transform'),
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

const Wrapper = styled('div')(() => {
  return {
    button: {
      marginRight: '16px',
      marginBottom: '16px',
    },
  };
});

const popup = <span>This is popper</span>;

const Trigger = () => {
  const [open, setOpen] = useState(false);

  const handleCustomClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleOpen = useCallback((v: boolean) => {
    console.log(v);
  }, []);

  return (
    <Wrapper>
      <PopperRoot placement='top' popup={popup} transitionClassName='slide' trigger='hover'>
        <Button color='primary'>hover</Button>
      </PopperRoot>
      <PopperRoot placement='top' popup={popup} transitionClassName='slide' trigger='click'>
        <Button color='primary'>click</Button>
      </PopperRoot>
      <PopperRoot placement='top' popup={popup} transitionClassName='slide' trigger='focus'>
        <Button color='primary'>focus</Button>
      </PopperRoot>
      <PopperRoot placement='top' popup={popup} transitionClassName='slide' trigger='contextMenu'>
        <Button color='primary'>contextMenu</Button>
      </PopperRoot>
      <PopperRoot
        open={open}
        placement='top'
        popup={popup}
        transitionClassName='slide'
        trigger={false}
        onOpenChange={handleOpen}
      >
        <Button color='primary' onClick={handleCustomClick}>
          custom(click twice)
        </Button>
      </PopperRoot>
    </Wrapper>
  );
};

export default Trigger;
