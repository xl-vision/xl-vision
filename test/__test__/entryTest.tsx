/* eslint-disable @typescript-eslint/no-var-requires */
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
  it('@xl-vision/popper', () => {
    const components = require('../../packages/popper/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
  it('@xl-vision/form', () => {
    const components = require('../../packages/form/src');
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
