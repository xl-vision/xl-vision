function readPackage(pkg, context) {
  if (pkg.name !== 'root') {
    return pkg;
  }

  // Fix the problem that csstype dependent on @types/react cannot be referenced
  pkg.devDependencies = {
    ...pkg.devDependencies,
    csstype: '^3.0.2',
  };

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
