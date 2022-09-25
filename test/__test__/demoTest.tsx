/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */

import { render } from '@testing-library/react';
import glob from 'glob';

describe('Demo', () => {
  const files = glob.sync(`./packages/*/src/**/__doc__/*.ts?(x)`);
  files.forEach((file) => {
    test(`renders ${file} correctly`, () => {
      const Demo = require(`../.${file}`).default;
      const { container } = render(<Demo />);
      expect(container).toMatchSnapshot();
    });
  });
});
