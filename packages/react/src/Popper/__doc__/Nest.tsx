import React from 'react';
import { Popper, Button, styled } from '@xl-vision/react';

const Wrapper = styled('div')(({ theme }) => {
  return {
    button: {
      marginRight: '16px',
      marginBottom: '16px',
    },
    '.slide': {
      '&-enter-active, &-leave-active': {
        transition: theme.transition.standard('transform'),
        '&[data-placement^="top"]': {
          transformOrigin: '0 100%',
        },
        '&[data-placement^="bottom"]': {
          transformOrigin: '0 0',
        },
      },
      '&-enter,&-leave-to': {
        '&[data-placement^="top"]': {
          transform: 'scaleY(0)',
        },
        '&[data-placement^="bottom"]': {
          transform: 'scaleY(0)',
        },
      },
      '&-enter-to,&-leave': {
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

const getPopupContainer = () => document.body;

const popup = (
  <span>
    parent popup
    <Popper getPopupContainer={getPopupContainer} trigger='click' popup={<span>child popup</span>}>
      <Button>btn</Button>
    </Popper>
  </span>
);

export default () => {
  const [visible, setVisible] = React.useState(false);

  const handleCustomClick = React.useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return (
    <Wrapper>
      <Popper
        trigger='hover'
        getPopupContainer={getPopupContainer}
        transitionClasses='slide'
        placement='top'
        popup={popup}
      >
        <Button>hover</Button>
      </Popper>
      <Popper
        trigger='click'
        getPopupContainer={getPopupContainer}
        transitionClasses='slide'
        placement='top'
        popup={popup}
      >
        <Button>click</Button>
      </Popper>
      <Popper
        trigger='focus'
        getPopupContainer={getPopupContainer}
        transitionClasses='slide'
        placement='top'
        popup={popup}
      >
        <Button>focus</Button>
      </Popper>
      <Popper
        trigger='contextMenu'
        getPopupContainer={getPopupContainer}
        transitionClasses='slide'
        placement='top'
        popup={popup}
      >
        <Button>contextMenu</Button>
      </Popper>
      <Popper
        trigger='custom'
        getPopupContainer={getPopupContainer}
        visible={visible}
        transitionClasses='slide'
        placement='top'
        popup={popup}
      >
        <Button onClick={handleCustomClick}>custom(click twice)</Button>
      </Popper>
    </Wrapper>
  );
};
