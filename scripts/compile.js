const fs = require('fs-extra');
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const argv = require('minimist')(process.argv.slice(2));
const path = require('node:path');
const typescript = require('typescript');
const getBabelConfig = require('./getBabelConfig');

const defaultReporter = ts.reporter.defaultReporter();

const styles = ['modern', 'legacy'];

const style = (argv._ || []).find((it) => styles.includes(it));

if (!style) {
  throw new TypeError(`Please provide one build style.`);
}

run();

async function run() {
  const basePath = process.cwd();
  await fs.remove(path.resolve(basePath, style));

  const tsconfigPath = path.resolve(basePath, 'tsconfig.json');

  const tsProject = ts.createProject(tsconfigPath, {
    typescript,
  });

  const paths = ['src/**/*.ts?(x)', '!**/__doc__/**', '!**/__test__/**'];

  return new Promise((resolve, reject) => {
    const errors = [];
    const tsResult = gulp.src(paths).pipe(
      tsProject({
        error(err, instance) {
          defaultReporter.error(err, instance);
          errors.push(err);
        },
        finish() {
          if (errors.length > 0) {
            return reject(errors);
          }
          return resolve();
        },
      }),
    );
    tsResult.dts.pipe(gulp.dest(style));
    tsResult.js.pipe(babel(getBabelConfig(style))).pipe(gulp.dest(style));
  });
}
