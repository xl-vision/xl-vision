import React from 'react';
import { Anchor } from '@xl-vision/react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { noop } from '@xl-vision/utils';
import * as perf from '../../utils/perf';
import wait from '../../../../../test/wait';

describe('Anchor', () => {
  const link = 'link';

  beforeAll(() => {
    const div = document.createElement('div');
    div.id = link;
    document.body.append(div);

    const throttleByAnimationFrameSpy = jest.spyOn(perf, 'throttleByAnimationFrame');

    throttleByAnimationFrameSpy.mockImplementation((fn) => {
      const cb: any = fn;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      cb.cancel = noop;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return cb;
    });

    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 100,
      top: 1000,
    } as DOMRect);
    jest
      .spyOn(HTMLElement.prototype, 'getClientRects')
      .mockReturnValue({ length: 1 } as DOMRectList);

    jest.spyOn(HTMLElement.prototype, 'clientTop', 'get').mockReturnValue(1000);

    jest.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      if (typeof x === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        y = (x as any).top;
      }
      window.scrollY = y;
      window.pageYOffset = y;
      document.documentElement.scrollTop = y;
    });
  });

  it('Anchor render perfectly for complete href - click', async () => {
    const handleChange = jest.fn();

    const wrapper = mount(
      <Anchor onChange={handleChange}>
        <Anchor.Link href={`#${link}`} title={link} />
      </Anchor>,
    );
    wrapper.find(`a[href="#${link}"]`).simulate('click');

    wrapper.update();

    await act(() => wait(0));

    expect(wrapper.find(`a.xl-anchor-link__title--active`).text()).toBe(link);

    expect(handleChange).lastCalledWith(`#${link}`);
  });
});
