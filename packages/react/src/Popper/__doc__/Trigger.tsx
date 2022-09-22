import { Popper, Button, styled } from '@xl-vision/react';
import { useState, useCallback } from 'react';

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
  const [visible, setVisible] = useState(false);

  const handleCustomClick = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  const handleVisible = useCallback((_visible: boolean) => {
    console.log(_visible);
  }, []);

  return (
    <Wrapper>
      <PopperRoot trigger='hover' transitionClassName='slide' placement='top' popup={popup}>
        <Button color='primary'>hover</Button>
      </PopperRoot>
      <PopperRoot trigger='click' transitionClassName='slide' placement='top' popup={popup}>
        <Button color='primary'>click</Button>
      </PopperRoot>
      <PopperRoot trigger='focus' transitionClassName='slide' placement='top' popup={popup}>
        <Button color='primary'>focus</Button>
      </PopperRoot>
      <PopperRoot trigger='contextMenu' transitionClassName='slide' placement='top' popup={popup}>
        <Button color='primary'>contextMenu</Button>
      </PopperRoot>
      <PopperRoot
        trigger='custom'
        visible={visible}
        onVisibleChange={handleVisible}
        transitionClassName='slide'
        placement='top'
        popup={popup}
      >
        <Button color='primary' onClick={handleCustomClick}>
          custom(click twice)
        </Button>
      </PopperRoot>
    </Wrapper>
  );
};

export default Trigger;
