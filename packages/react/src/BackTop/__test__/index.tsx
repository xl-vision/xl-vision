import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { noop } from '@xl-vision/utils';
import * as utils from '@xl-vision/utils';
import BackTop from '../BackTop';
import wait from '../../../../../test/wait';

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

    const wrapper = mount(<BackTop visibilityHeight={-1} onChange={call} />);

    window.scrollTo(0, 400);
    document.dispatchEvent(new Event('scroll', { bubbles: true }));

    // 等待事件触发
    await act(() => wait(0));

    wrapper.update();

    // expect(document.documentElement.scrollTop).toBe(400);

    wrapper.find('div.xl-back-top').simulate('click');

    // expect(document.documentElement.scrollTop).toBe(0);
    expect(call).toBeCalledTimes(1);
    expect(call).toBeCalledWith(true);
  });

  it('test controlled state', () => {
    const wrapper = mount(<BackTop show={false} />);

    expect(wrapper.exists('div.xl-back-top')).toBe(false);

    wrapper.setProps({
      show: true,
    });

    wrapper.update();
    expect(wrapper.exists('div.xl-back-top')).toBe(true);
  });
});
