/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

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
  it('@xl-vision/styled-engine-sc', () => {
    const components = require('../../packages/styled-engine-sc/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
  it('match @xl-vision/styled-engine-sc and @xl-vision/styled-engine', () => {
    const scComponents = require('../../packages/styled-engine-sc/src');
    const emComponents = require('../../packages/styled-engine/src');
    const scComponentKeys = Object.keys(scComponents);
    const emComponentKeys = Object.keys(emComponents);
    expect(scComponentKeys.length).toBe(emComponentKeys.length);
    scComponentKeys.forEach((k) => {
      expect(emComponentKeys.includes(k)).toBe(true);
    });
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
