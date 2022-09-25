import { renderHook } from 'test/utils';
import useConstantFn from '..';

describe('useConstantFn', () => {
  it('Test function reference unchanged', () => {
    const { result, rerender } = renderHook((fn: () => any) => useConstantFn(fn), {
      initialProps: () => {
        return 1;
      },
    });

    const { current } = result;

    expect(current()).toBe(1);

    rerender(() => {
      return 2;
    });

    const next = result.current;

    expect(next()).toBe(2);

    expect(current).toBe(next);
  });
});
