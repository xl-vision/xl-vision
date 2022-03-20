const rollup = require('rollup');
const babel = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const ts = require('gulp-typescript');
const { terser } = require('rollup-plugin-terser');
const getBabelConfig = require('./getBabelConfig');

const defaultReporter = ts.reporter.defaultReporter();

const entry = argv.entry || 'src/index.ts';

async function run() {
  const basePath = process.cwd();

  const input = path.resolve(basePath, entry);

  const build = await rollup.rollup({
    input,
    external: ['react', 'react-dom'],
    plugins: [
      babel({
        ...getBabelConfig('modern'),
      }),
    ],
  });

  const outputConfig = {
    dir: path.resolve(basePath, 'dist'),
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  };

  const p1 = await build.write({
    ...outputConfig,
    file: 'index.production.min.js',
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser(),
    ],
  });

  const p2 = await build.write({
    ...outputConfig,
    file: 'index.development.js',
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  });

  return Promise.all(p1, p2);
}
