import { act } from '@testing-library/react';
import { awaitPromise } from './promise';

// eslint-disable-next-line import/prefer-default-export
export const triggerTransitionEnd = async () => {
  await awaitPromise();
  for (let i = 0; i < 5; i += 1) {
    act(() => {
      jest.runAllTimers();
    });
  }
  await awaitPromise();
};
