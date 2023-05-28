import { fireEvent, render } from '@testing-library/react';
import { useRef, useMemo } from 'react';
import { triggerTransitionEnd } from 'test/utils';
import { Ripple, RippleRef } from '@xl-vision/react';

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
      <Ripple exitAfterEnter={exitAfterEnter} ref={rippleRef} transitionClassName='ripple' />
    </div>
  );
};

describe('Ripple', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('test render', async () => {
    const { container } = render(
      <div>
        click me
        <Ripple transitionClassName='ripple' />
      </div>,
    );

    await triggerTransitionEnd();

    expect(container).toMatchSnapshot();
  });

  it('test event', async () => {
    const { container } = render(<Demo />);

    const div = container.querySelector('.box')!;

    fireEvent.mouseDown(div);

    await triggerTransitionEnd();

    const doms = container.querySelectorAll<HTMLElement>('.xl-ripple__inner');
    expect(doms.length).toBe(1);
    expect(doms[0].style.display).toBe('');

    fireEvent.mouseUp(div);

    await triggerTransitionEnd();

    expect(container.querySelectorAll<HTMLElement>('.xl-ripple__inner').length).toBe(0);

    fireEvent.blur(div);

    await triggerTransitionEnd();

    expect(container.querySelectorAll<HTMLElement>('.xl-ripple__inner').length).toBe(0);
  });
});
