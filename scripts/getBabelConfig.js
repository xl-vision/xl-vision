module.exports = function getBabelConfig(style, runtime = true) {
  const useESModules = style === 'modern';

  const presets = [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        shippedProposals: style === 'modern',
        modules: useESModules ? false : 'commonjs',
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ];

  const plugins = [
    runtime && [
      '@babel/plugin-transform-runtime',
      {
        useESModules,
        // any package needs to declare 7.4.4 as a runtime dependency. default is ^7.0.0
        version: '^7.4.4',
      },
    ],
  ].filter(Boolean);

  return {
    presets,
    plugins,
  };
};
