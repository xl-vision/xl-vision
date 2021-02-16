describe('check component list', () => {
  it('list components in @xl-vision/react', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,global-require
    const components = require('../../packages/react/src');
    expect(Object.keys(components)).toMatchSnapshot();
  });
});
