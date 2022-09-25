import { waitFor } from '@testing-library/react';

export default (time: number) =>
  waitFor(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, time);
      }),
  );
