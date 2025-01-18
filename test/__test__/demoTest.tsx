/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { render } from '@testing-library/react';
import * as glob from 'glob';
import { act } from 'react';
import ReactDOM from 'react-dom';

describe('Demo', () => {
  let mockFn: jest.SpyInstance;
  beforeAll(() => {
    const flushSync = ReactDOM.flushSync;
    mockFn = jest.spyOn(ReactDOM, 'flushSync');
    mockFn.mockImplementation((fn) => {
      act(() => {
        flushSync(fn);
      });
    });
  });

  afterAll(() => {
    mockFn.mockClear();
  });

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
