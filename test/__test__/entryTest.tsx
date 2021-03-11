/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

describe('Entry', () => {
  it('@xl-vision/react', () => {
    const components = require('../../packages/react/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
});
