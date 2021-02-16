import glob from 'glob';
import { mount } from 'enzyme';
import React from 'react';

const demoTest = () => {
  const files = glob.sync(`./packages/*/src/**/__doc__/*.ts?(x)`);
  files.forEach((file) => {
    test(`renders ${file} correctly`, () => {
      // eslint-disable-next-line global-require, import/no-dynamic-require,@typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const Demo = require(`../.${file}`).default;
      const wrapper = mount(<Demo />);
      expect(wrapper).toMatchSnapshot();
    });
  });
};

demoTest();
