import usePrevious from '..';
import { renderHook } from '../../../../../test/utils';

describe('usePrevious', () => {
  it('Test always get last value', () => {
    const { result, rerender } = renderHook(usePrevious, {
      initialProps: 1,
    });

    expect(result.current).toBe(undefined);

    rerender(2);
    expect(result.current).toBe(1);

    rerender(3);

    expect(result.current).toBe(2);
  });
});
