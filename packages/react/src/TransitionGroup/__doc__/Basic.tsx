import React from 'react';
import { styled, TransitionGroup } from '@xl-vision/react';

const Wrapper = styled('div')``;
const Demo = styled('span')`
  display: inline-block;
  margin-right: 10px;

  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 1s ease-in-out;
  }

  &.slide-leave-to,
  &.slide-enter {
    opacity: 0;
  }

  &.slide-leave,
  &.slide-enter-to {
    opacity: 1;
    transform: translateY(0px);
  }

  &.slide-enter {
    transform: translateY(-30px);
  }
  &.slide-leave-to {
    transform: translateY(30px);
  }
`;

export default () => {
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
        <button onClick={handleAdd}>add</button>
        <button onClick={handleRemove}>remove</button>
      </div>
      <Wrapper>
        <TransitionGroup transitionClasses='slide'>
          {items.map((it) => (
            <Demo key={it}>{it}</Demo>
          ))}
        </TransitionGroup>
      </Wrapper>
    </div>
  );
};
