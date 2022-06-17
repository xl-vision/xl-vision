import React from 'react';
import { Button, styled, TransitionGroup } from '@xl-vision/react';

const Wrapper = styled('div')({
  marginTop: 20,
});

const Demo = styled('span')({
  display: 'inline-block',
  marginRight: 10,
  '&.slide-enter-active,&.slide-exit-active': {
    transition: 'all 1s ease-in-out',
  },

  '&.slide-exit-to, &.slide-enter-from': {
    opacity: 0,
  },
  ' &.slide-exit-from, &.slide-enter-to': {
    opacity: 1,
    transform: 'translateY(0px)',
  },
  '&.slide-enter-from': {
    transform: 'translateY(-30px)',
  },
  '&.slide-exit-to': {
    transform: 'translateY(30px)',
  },
});

const Basic = () => {
  const nextNumRef = React.useRef(10);

  const [items, setItems] = React.useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const handleAdd = React.useCallback(() => {
    setItems((prev) => {
      const index = Math.round(Math.random() * prev.length);
      prev.splice(index, 0, nextNumRef.current++);
      return [...prev];
    });
  }, []);

  const handleRemove = React.useCallback(() => {
    setItems((prev) => {
      const index = Math.round(Math.random() * prev.length);
      prev.splice(index, 1);
      return [...prev];
    });
  }, []);

  return (
    <div>
      <div>
        <Button color='primary' onClick={handleAdd} style={{ marginRight: 10 }}>
          add
        </Button>
        <Button color='primary' onClick={handleRemove}>
          remove
        </Button>
      </div>
      <Wrapper>
        <TransitionGroup transitionClassName='slide'>
          {items.map((it) => (
            <Demo key={it}>{it}</Demo>
          ))}
        </TransitionGroup>
      </Wrapper>
    </div>
  );
};

export default Basic;
