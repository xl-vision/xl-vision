import { Ripple, RippleRef } from '@xl-vision/react';
import { useRef, useMemo } from 'react';
import { act, fireEvent, render } from '@testing-library/react';

const Demo = ({ exitAfterEnter }: { exitAfterEnter?: boolean }) => {
  const rippleRef = useRef<RippleRef>(null);

  const events = useMemo(() => {
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
      <Ripple exitAfterEnter={exitAfterEnter} transitionClassName='ripple' ref={rippleRef} />
    </div>
  );
};

describe('Ripple', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test render', () => {
    const { container } = render(
      <div>
        click me
        <Ripple transitionClassName='ripple' />
      </div>,
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(container).toMatchSnapshot();
  });

  it('test event', () => {
    const { container } = render(<Demo />);

    const div = container.querySelector('.box')!;

    fireEvent.mouseDown(div);

    act(() => {
      jest.runAllTimers();
    });

    const doms = container.querySelectorAll<HTMLElement>('.xl-ripple__inner');
    expect(doms.length).toBe(1);
    expect(doms[0].style.display).toBe('');

    fireEvent.mouseUp(div);

    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelectorAll<HTMLElement>('.xl-ripple__inner').length).toBe(0);

    fireEvent.blur(div);

    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelectorAll<HTMLElement>('.xl-ripple__inner').length).toBe(0);
  });
});
