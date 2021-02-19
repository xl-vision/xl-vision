/* eslint-disable global-require */
import { mount } from 'enzyme';
import React from 'react';
import * as iconComponents from '../../packages/icons/src';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('check packages entry', () => {
  it('@xl-vision/react', () => {
    const components = require('../../packages/react/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });

  it('@xl-vision/icons', () => {
    console.log(iconComponents);

    Object.keys(iconComponents).forEach((key) => {
      // @ts-ignore
      const Component = iconComponents[key];
      const wrapper = mount(<Component />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
