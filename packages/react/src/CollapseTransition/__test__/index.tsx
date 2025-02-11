import { render, screen } from '@testing-library/react';
import * as utils from '@xl-vision/utils';
import { act } from 'react';
import { awaitPromise } from 'test/utils';
import { CollapseTransition } from '@xl-vision/react';

const temp = window.getComputedStyle;

window.getComputedStyle = (e: Element, p?: string | null) => {
  const styles = temp(e, p);

  styles.width = '100px';
  styles.height = '100px';

  return styles;
};

describe('CollapseTransition', () => {
  const nextFrame = jest.spyOn(utils, 'nextFrame').mockImplementation();
  const onTransitionEnd = jest.spyOn(utils, 'onTransitionEnd').mockImplementation();

  beforeEach(() => {
    nextFrame.mockClear();
    onTransitionEnd.mockClear();
  });

  it('Test expand state', async () => {
    const { rerender } = render(
      <CollapseTransition in={false}>
        <div data-testid='demo' />
      </CollapseTransition>,
    );

    expect(screen.queryByTestId('demo')).toBe(null);

    rerender(
      <CollapseTransition in={true}>
        <div data-testid='demo' />
      </CollapseTransition>,
    );

    await awaitPromise();

    const el = screen.getByTestId('demo');

    expect(el.style.overflow).toEqual('hidden');
    expect(el.style.height).toEqual('100px');

    act(() => {
      nextFrame.mock.calls[0][0]();
    });
    act(() => {
      onTransitionEnd.mock.calls[0][1]();
    });

    expect(el.style.overflow).toEqual('');
    expect(el.style.height).toEqual('');
  });

  it('Test horizontal expand state', async () => {
    const { rerender } = render(
      <CollapseTransition horizontal={true} in={false}>
        <div data-testid='demo' />
      </CollapseTransition>,
    );

    expect(screen.queryByTestId('demo')).toBe(null);

    rerender(
      <CollapseTransition horizontal={true} in={true}>
        <div data-testid='demo' />
      </CollapseTransition>,
    );

    await awaitPromise();

    const el = screen.getByTestId('demo');

    expect(el.style.overflow).toEqual('hidden');
    expect(el.style.width).toEqual('100px');

    act(() => {
      nextFrame.mock.calls[0][0]();
    });
    act(() => {
      onTransitionEnd.mock.calls[0][1]();
    });

    expect(el.style.overflow).toEqual('');
    expect(el.style.width).toEqual('');
  });
});
