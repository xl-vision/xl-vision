import { act } from 'react';
import { awaitPromise } from './promise';

export const triggerTransitionEnd = async () => {
  await act(async () => {
    await awaitPromise();
    for (let i = 0; i < 5; i += 1) {
      jest.runAllTimers();
    }
    await awaitPromise();
  });
};
