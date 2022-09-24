import useForkRef from '..';
import { renderHook } from '../../../../../test/utils';

describe('useForkRef', () => {
  it('Test all ref is set value', () => {
    const ref1 = jest.fn();

    const ref2 = {
      current: null,
    };

    const { result } = renderHook(() => useForkRef<any>(ref1, ref2));

    (result.current as any)(123);

    expect(ref1.mock.calls[0][0]).toBe(123);
    expect(ref2.current).toBe(123);
  });
});
