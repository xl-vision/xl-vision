import useLatestRef from '..';
import { renderHook } from '../../../../../test/utils';

describe('useLatestRef', () => {
  it('Test value is always kept up to date', () => {
    const { result, rerender } = renderHook(useLatestRef, {
      initialProps: 1,
    });

    expect(result.current.current).toBe(1);

    rerender(2);

    expect(result.current.current).toBe(2);
  });
});
