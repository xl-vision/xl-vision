import React from 'react';
import { Transition, styled } from '@xl-vision/react';
import { BeforeEventHook, EventHook } from '@xl-vision/react/Transition';

const Div = styled('div')`
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

  const beforeEnter: BeforeEventHook = React.useCallback((el) => {
    el.style.height = el.style.height || 0;
  }, []);

  const enter: EventHook = React.useCallback((el, done, isCancelled) => {
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
  }, []);

  const leave: EventHook = React.useCallback((el, done, isCancelled) => {
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
  }, []);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Click</button>
      <Transition in={show} beforeEnter={beforeEnter} enter={enter} leave={leave}>
        <Div className='demo'>DEMO</Div>
      </Transition>
    </div>
  );
};
