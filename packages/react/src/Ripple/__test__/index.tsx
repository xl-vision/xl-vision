import { mount } from 'enzyme';
import React from 'react';
import Ripple, { RippleRef } from '..';
import wait from '../../../../../test/wait';
import * as TransitionUtils from '../../utils/transition';

const Demo = ({ leaveAfterEnter }: { leaveAfterEnter?: boolean }) => {
  const rippleRef = React.useRef<RippleRef>(null);

  const events = React.useMemo(() => {
    const start = (e: any) => {
      rippleRef.current?.start(e);
    };
    const stop = () => {
      rippleRef.current?.stop();
    };
    return {
      onMouseDown: start,
      onTouchStart: start,
      onMouseUp: stop,
      onTouchEnd: stop,
      onTouchMove: stop,
      onMouseLeave: stop,
      onDragLeave: stop,
      onBlur: stop,
    };
  }, []);

  return (
    <div className='box' {...events}>
      click me
      <Ripple leaveAfterEnter={leaveAfterEnter} transitionClasses='ripple' ref={rippleRef} />
    </div>
  );
};

describe('Ripple', () => {
  let onTransitionEndSpy: jest.SpyInstance;
  let nextFrameSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useRealTimers();

    onTransitionEndSpy = jest.spyOn(TransitionUtils, 'onTransitionEnd');
    // 保证动画有一定的时间
    onTransitionEndSpy.mockImplementation((_el, done: () => void) => {
      setTimeout(done, 25);
    });

    nextFrameSpy = jest.spyOn(TransitionUtils, 'nextFrame');
    nextFrameSpy.mockImplementation((done: () => void) => {
      const id = setTimeout(done, 25);
      return () => {
        clearTimeout(id);
      };
    });
  });
  it('test render', () => {
    const wrapper = mount(
      <div>
        click me
        <Ripple transitionClasses='ripple' />
      </div>,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('test event', async () => {
    const wrapper = mount(<Demo />);
    wrapper.find('.box').simulate('mousedown');
    const doms = wrapper.getDOMNode().querySelectorAll<HTMLElement>('.xl-ripple-inner');
    expect(doms.length).toBe(1);
    expect(doms[0].style.display).toBe('');

    wrapper.find('.box').simulate('mouseup');
    await wait(50 + 10);
    expect(wrapper.getDOMNode().querySelectorAll<HTMLElement>('.xl-ripple-inner').length).toBe(0);

    wrapper.find('.box').simulate('blur');
    await wait(50 + 10);
    expect(wrapper.getDOMNode().querySelectorAll<HTMLElement>('.xl-ripple-inner').length).toBe(0);
  });
});
