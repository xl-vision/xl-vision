import { mount } from 'enzyme';
import React from 'react';
import { Ripple, RippleRef } from '@xl-vision/react';

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
      <Ripple leaveAfterEnter={leaveAfterEnter} transitionClassName='ripple' ref={rippleRef} />
    </div>
  );
};

describe('Ripple', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test render', () => {
    const wrapper = mount(
      <div>
        click me
        <Ripple transitionClassName='ripple' />
      </div>,
    );
    jest.runAllTimers();

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('test event', () => {
    const wrapper = mount(<Demo />);
    wrapper.find('.box').simulate('mousedown');

    jest.runAllTimers();

    const doms = wrapper.getDOMNode().querySelectorAll<HTMLElement>('.xl-ripple__inner');
    expect(doms.length).toBe(1);
    expect(doms[0].style.display).toBe('');

    wrapper.find('.box').simulate('mouseup');

    jest.runAllTimers();

    expect(wrapper.getDOMNode().querySelectorAll<HTMLElement>('.xl-ripple__inner').length).toBe(0);

    wrapper.find('.box').simulate('blur');
    jest.runAllTimers();

    expect(wrapper.getDOMNode().querySelectorAll<HTMLElement>('.xl-ripple__inner').length).toBe(0);
  });
});
