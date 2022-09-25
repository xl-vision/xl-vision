import { renderHook } from 'test/utils';
import useLifecycleState, { LifecycleState } from '..';

describe('useLifecycleState', () => {
  it('Test state change', () => {
    const { result, unmount } = renderHook(useLifecycleState);

    expect(result.current.current).toBe(LifecycleState.MOUNTED);

    unmount();

    expect(result.current.current).toBe(LifecycleState.DESTORYED);
  });
});
