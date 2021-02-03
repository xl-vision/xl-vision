const argv = require('minimist')(process.argv.slice(2));
const babel = require('gulp-babel');
const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const getBabelConfig = require('./getBabelConfig');

const defaultReporter = ts.reporter.defaultReporter();

const styles = ['modern', 'legacy'];

const style = (argv._ || []).find((it) => styles.includes(it));

if (!style) {
  throw new TypeError(`Please provide one build style.`);
}

run();

function run() {
  const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');

  const tsProject = ts.createProject(tsconfigPath);

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
