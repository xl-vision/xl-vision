/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */

import glob from 'glob';
import { mount } from 'enzyme';

describe('Demo', () => {
  const files = glob.sync(`./packages/*/src/**/__doc__/*.ts?(x)`);
  files.forEach((file) => {
    test(`renders ${file} correctly`, () => {
      const Demo = require(`../.${file}`).default;
      const wrapper = mount(<Demo />);
      expect(wrapper.render()).toMatchSnapshot();
    });
  });
});
