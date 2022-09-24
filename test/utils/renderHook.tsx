// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FC, MutableRefObject, useRef } from 'react';

export type RenderHookOptions<P> = Partial<{
  initialProps: P;
}>;

export const renderHook = <P, R>(
  useHook: (p: P) => R,
  { initialProps }: RenderHookOptions<P> = {},
) => {
  let store: MutableRefObject<R>;

  const Demo: FC<{ props: P }> = ({ props }) => {
    const result = useHook(props);

    const ref = useRef<R>(result);

    ref.current = result;

    store = ref;

    return null;
  };

  const { rerender, unmount } = render(<Demo props={initialProps!} />);

  const newRerender = (props: P) => {
    rerender(<Demo props={props} />);
    return {
      result: store!,
    };
  };

  return {
    rerender: newRerender,
    result: store!,
    unmount,
  };
};
