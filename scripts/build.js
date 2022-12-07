const alias = require('@rollup/plugin-alias');
const { getBabelInputPlugin } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const terser = require('@rollup/plugin-terser');
const fs = require('fs-extra');
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const rollup = require('rollup');
const getBabelConfig = require('./getBabelConfig');

const entry = argv.entry || 'src/index.ts';

function build(isProd) {
  const basePath = process.cwd();

  const input = path.resolve(basePath, entry);

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const packageName = require(path.resolve(basePath, 'package.json')).name;

  const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'];

  const babelConfig = getBabelConfig('modern', false);

  const aliasEntries = {};

  const packages = glob.sync('../*');

  packages.forEach((it) => {
    if (it === 'packages/styled-engine-types') {
      return;
    }
    const packagePath = path.resolve(basePath, it);
    if (packagePath === basePath) {
      return;
    }
    const { name } = fs.readJSONSync(path.resolve(packagePath, 'package.json'));
    aliasEntries[name] = path.resolve(packagePath, 'src');
  });

  return rollup
    .rollup({
      input,
      external: ['react', 'react-dom'],
      plugins: [
        alias({
          entries: aliasEntries,
        }),
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
        }),
        nodeResolve({
          extensions,
        }),
        commonjs({
          include: /node_modules/,
        }),
        getBabelInputPlugin({
          extensions,
          plugins: babelConfig.plugins,
          presets: [...babelConfig.presets, '@babel/preset-typescript'],
          babelHelpers: 'bundled',
        }),
      ],
    })
    .then((it) =>
      it.write({
        format: 'umd',
        name: packageName,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        file: path.resolve(
          basePath,
          'dist',
          isProd ? 'index.production.min.js' : 'index.development.js',
        ),
        sourcemap: true,
        plugins: [isProd && terser({ sourceMap: true })].filter(Boolean),
      }),
    );
}

function run() {
  return Promise.all([build(), build(true)]);
}

run();
