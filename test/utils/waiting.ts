import { waitFor } from '@testing-library/react';

const waiting = (time: number) =>
  waitFor(
    () =>
      new Promise((resolve) => {
        setTimeout(resolve, time);
      }),
  );

export default waiting;
