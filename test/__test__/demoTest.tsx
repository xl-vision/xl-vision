/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { render } from '@testing-library/react';
import * as glob from 'glob';

describe('Demo', () => {
  const files = glob.sync(`./packages/*/src/**/__doc__/*.ts?(x)`, {
    posix: true,
  });
  files.forEach((file) => {
    test(`renders ${file} correctly`, () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Demo = require(`../../${file}`).default;
      const ret = render(<Demo />);
      const container = ret.container;

      expect(container).toMatchSnapshot();
    });
  });
});
