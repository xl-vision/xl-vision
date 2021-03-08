import React from 'react';
import { Button, styled, Transition } from '@xl-vision/react';
import { BeforeEventHook, EventHook } from '@xl-vision/react/Transition';

const Div = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #fff;
  font-size: 3rem;
  background-color: #007bff;
  overflow: hidden;
  margin-top: 16px;
`;

export default () => {
  const [show, setShow] = React.useState(true);

  const beforeEnter: BeforeEventHook = React.useCallback((el) => {
    el.style.height = el.style.height || '0';
  }, []);

  const enter: EventHook = React.useCallback((el, done, isCancelled) => {
    let height = Number(el.style.height.substring(0, el.style.height.indexOf('px')) || 0);
    const callback = () => {
      const id = requestAnimationFrame(() => {
        if (isCancelled()) {
          cancelAnimationFrame(id);
          return;
        }
        if (height >= 200) {
          cancelAnimationFrame(id);
          done();
          return;
        }
        height += 2;
        el.style.height = `${height}px`;
        callback();
      });
    };
    callback();
  }, []);

  const leave: EventHook = React.useCallback((el, done, isCancelled) => {
    let height = Number(el.style.height.substring(0, el.style.height.indexOf('px')) || 200);
    const callback = () => {
      const id = requestAnimationFrame(() => {
        if (isCancelled()) {
          cancelAnimationFrame(id);
          return;
        }
        if (height <= 0) {
          cancelAnimationFrame(id);
          done();
          return;
        }
        height -= 2;
        el.style.height = `${height}px`;
        callback();
      });
    };
    callback();
  }, []);

  return (
    <div>
      <Button theme='primary' onClick={() => setShow(!show)}>
        Click
      </Button>
      <p>进场动画</p>
      <Transition
        transitionOnFirst={true}
        in={show}
        beforeEnter={beforeEnter}
        enter={enter}
        leave={leave}
        mountOnEnter={true}
        unmountOnLeave={true}
      >
        <Div>DEMO</Div>
      </Transition>
      <p>出场动画</p>
      <Transition
        transitionOnFirst={true}
        in={!show}
        beforeEnter={beforeEnter}
        enter={enter}
        leave={leave}
        mountOnEnter={true}
        unmountOnLeave={true}
      >
        <Div>DEMO</Div>
      </Transition>
    </div>
  );
};
