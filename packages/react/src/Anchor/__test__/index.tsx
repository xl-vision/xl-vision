import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@xl-vision/utils';
import { Anchor } from '@xl-vision/react';
import * as perf from '../../utils/perf';

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

    const { container } = render(
      <Anchor onChange={handleChange}>
        <Anchor.Link href={`#${link}`} title={link} />
      </Anchor>,
    );

    const user = userEvent.setup();

    const el = container.querySelector(`a[href="#${link}"]`)!;

    await user.click(el);

    expect(el.classList.contains('xl-anchor-link__title--active')).toBe(true);

    expect(handleChange).lastCalledWith(`#${link}`);
  });
});
