/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

describe('Entry', () => {
  it('@xl-vision/utils', () => {
    const components = require('../../packages/utils/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
  it('@xl-vision/hooks', () => {
    const components = require('../../packages/hooks/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
  it('@xl-vision/usePopper', () => {
    const components = require('../../packages/usePopper/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
  it('@xl-vision/useForm', () => {
    const components = require('../../packages/useForm/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
  it('@xl-vision/styled-engine', () => {
    const components = require('../../packages/styled-engine/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
  it('@xl-vision/icons', () => {
    const components = require('../../packages/icons/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
  it('@xl-vision/react', () => {
    const components = require('../../packages/react/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
});
