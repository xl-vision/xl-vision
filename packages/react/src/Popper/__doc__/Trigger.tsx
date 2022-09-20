import { Popper, Button, styled } from '@xl-vision/react';
import { useState, useCallback } from 'react';

const Wrapper = styled('div')(({ theme }) => {
  return {
    button: {
      marginRight: '16px',
      marginBottom: '16px',
    },
    '.slide': {
      '&-enter-active, &-exit-active': {
        transition: theme.transition.standard('transform'),
        '&[data-placement^="top"]': {
          transformOrigin: '0 100%',
          transform: 'scaleY(1)',
        },
        '&[data-placement^="bottom"]': {
          transformOrigin: '0 0',
          transform: 'scaleY(1)',
        },
      },
      '&-enter-from,&-exit-to': {
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
      <Popper trigger='hover' transitionClassName='slide' placement='top' popup={popup}>
        <Button color='primary'>hover</Button>
      </Popper>
      <Popper trigger='click' transitionClassName='slide' placement='top' popup={popup}>
        <Button color='primary'>click</Button>
      </Popper>
      <Popper trigger='focus' transitionClassName='slide' placement='top' popup={popup}>
        <Button color='primary'>focus</Button>
      </Popper>
      <Popper trigger='contextMenu' transitionClassName='slide' placement='top' popup={popup}>
        <Button color='primary'>contextMenu</Button>
      </Popper>
      <Popper
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
      </Popper>
    </Wrapper>
  );
};

export default Trigger;
