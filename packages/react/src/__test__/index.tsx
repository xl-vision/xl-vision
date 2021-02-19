describe(`check package '@xl-vision/react' entry`, () => {
  it('list components', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,global-require
    const components = require('..');
    expect(Object.keys(components)).toMatchSnapshot();
  });
});
