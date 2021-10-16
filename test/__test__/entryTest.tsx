/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

describe('Entry', () => {
  it('@xl-vision/react', () => {
    const components = require('../../packages/react/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
  it('@xl-vision/icons', () => {
    const components = require('../../packages/icons/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
});
