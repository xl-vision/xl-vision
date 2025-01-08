/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { act, render } from '@testing-library/react';
import * as glob from 'glob';

describe('Demo', () => {
  const files = glob.sync(`./packages/*/src/**/__doc__/*.ts?(x)`, {
    posix: true,
  });
  files.forEach((file) => {
    test(`renders ${file} correctly`, () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Demo = require(`../../${file}`).default;
      let container: HTMLElement;
      act(() => {
        const ret = render(<Demo />);
        container = ret.container;
      });

      expect(container!).toMatchSnapshot();
    });
  });
});
