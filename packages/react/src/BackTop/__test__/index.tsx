import { noop } from '@xl-vision/utils';
import * as utils from '@xl-vision/utils';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackTop from '../BackTop';

jest.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
  if (typeof x === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    y = (x as any).top;
  }
  window.scrollY = y;
  window.pageYOffset = y;
  document.documentElement.scrollTop = y;
});

jest.spyOn(utils, 'nextFrame').mockImplementation((fn) => {
  fn();
  return noop;
});
jest.spyOn(utils, 'onTransitionEnd').mockImplementation((_, done) => {
  done();
  return noop;
});

describe('BackTop', () => {
  it('scroll top when click', async () => {
    const call = jest.fn();

    const { container } = render(<BackTop visibilityHeight={-1} onChange={call} />);

    window.scrollTo(0, 400);
    document.dispatchEvent(new Event('scroll', { bubbles: true }));

    const el = container.querySelector('div.xl-back-top')!;

    const user = userEvent.setup();

    await user.click(el);

    // expect(document.documentElement.scrollTop).toBe(0);
    expect(call).toBeCalledTimes(1);
    expect(call).toBeCalledWith(true);
  });

  it('test controlled state', () => {
    const { rerender } = render(<BackTop show={false} />);

    expect(document.querySelectorAll('div.xl-back-top').length).toBe(0);

    rerender(<BackTop show={true} />);

    expect(document.querySelectorAll('div.xl-back-top').length).toBe(1);
  });
});
