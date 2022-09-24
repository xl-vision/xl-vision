import useLifecycleState, { LifecycleState } from '..';
import { renderHook } from '../../../../../test/utils';

describe('useLifecycleState', () => {
  it('Test state change', () => {
    const { result, unmount } = renderHook(useLifecycleState);

    expect(result.current.current).toBe(LifecycleState.MOUNTED);

    unmount();

    expect(result.current.current).toBe(LifecycleState.DESTORYED);
  });
});
