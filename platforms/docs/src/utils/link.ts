export const join = (...paths: Array<string>) => {
  if (!paths.length) {
    return '';
  }
  const [first, ...others] = paths;

  const suffix = others.map((it) => it.replace(/^\//, '')).join('/');

  return first === '/' ? `${first}${suffix}` : [first, suffix].join('/');
};
