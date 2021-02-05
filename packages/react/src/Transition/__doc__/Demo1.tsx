import React from 'react';
import { Transition } from '@xl-vision/react';
import styled from '@xl-vision/styled-engine';

const Box = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #fff;
  font-size: 3rem;
  background-color: #007bff;
  margin-top: 16px;
`;

export default () => {
  const [show, setShow] = React.useState(false);

  const beforeEnter = React.useCallback((el: HTMLElement) => {
    el.style.height = el.style.height || '0';
  }, []);

  const enter = React.useCallback(
    (el: HTMLElement, done: () => void, isCancelled: () => boolean) => {
      let height = Number(el.style.height.substring(0, el.style.height.indexOf('px')) || 0);
      const timer = setInterval(() => {
        if (isCancelled()) {
          clearInterval(timer);
          return;
        }
        if (height > 200) {
          clearInterval(timer);
          done();
          return;
        }
        height += 2;
        el.style.height = `${height}px`;
      }, 20);
    },
    [],
  );

  const leave = React.useCallback(
    (el: HTMLElement, done: () => void, isCancelled: () => boolean) => {
      let height = Number(el.style.height.substring(0, el.style.height.indexOf('px')) || 200);
      const timer = setInterval(() => {
        if (isCancelled()) {
          clearInterval(timer);
          return;
        }
        if (height < 0) {
          clearInterval(timer);
          done();
          return;
        }
        height -= 2;
        el.style.height = `${height}px`;
      }, 20);
    },
    [],
  );

  const handleClick = React.useCallback(() => {
    setShow((prev) => !prev);
  }, []);

  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <Transition
        in={show}
        beforeEnter={beforeEnter}
        enter={enter}
        leave={leave}
        mountOnEnter={true}
        unmountOnLeave={true}
      >
        <Box>Demo1</Box>
      </Transition>
    </div>
  );
};
