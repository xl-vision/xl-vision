import { waitFor } from '@testing-library/dom';

export default (time: number) =>
  waitFor(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, time);
      }),
  );
