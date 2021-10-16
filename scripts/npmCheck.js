/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
const npmCheck = require('npm-check');
const updateAll = require('npm-check/lib/out/update-all');
const interactiveUpdate = require('npm-check/lib/out/interactive-update');
const staticOutput = require('npm-check/lib/out/static-output');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const defaultOptions = {
  update: true,
  spinner: true,
};

async function npmCheckWrap() {
  const packageDir = path.join(__dirname, '../packages');
  const packages = await fs.readdir(packageDir);

  let promise = Promise.resolve();

  for (const file of packages) {
    promise = promise.then(() =>
      check({
        cwd: path.join(packageDir, file),
        ...defaultOptions,
      }),
    );
  }

  const platformDir = path.join(__dirname, '../platforms');
  const platforms = await fs.readdir(platformDir);

  for (const file of platforms) {
    promise = promise.then(() =>
      check({
        cwd: path.join(platformDir, file),
        ...defaultOptions,
      }),
    );
  }

  promise = promise.then(() =>
    check({
      ...defaultOptions,
    }),
  );

  return promise;
}

npmCheckWrap();

const len = 60;

const msg = new Array(len).fill('*').join('');

function formatMsg(name) {
  const prefixCount = Math.round((len - name.length) / 2);
  const suffixCount = len - prefixCount - name.length;
  return (
    new Array(prefixCount).fill(' ').join('') + name + new Array(suffixCount).fill(' ').join('')
  );
}

async function check(options) {
  const cwd = options.cwd || process.cwd();

  const packageJsonPath = path.join(cwd, 'package.json');

  const exist = await fs.pathExists(packageJsonPath);

  if (!exist) {
    return;
  }

  const { name = '' } = await fs.readJSON(packageJsonPath);

  console.log(chalk.green(msg));
  console.log(chalk.green(formatMsg(name)));
  console.log(chalk.green(msg));

  try {
    options.installer = options.installer || 'npm';
    const currentState = await npmCheck(options);
    currentState.inspectIfDebugMode();

    if (options.updateAll) {
      await updateAll(currentState);
    }
    if (options.update) {
      await interactiveUpdate(currentState);
    }

    await staticOutput(currentState);

    console.log('\n');
    console.log(chalk.green(msg));
    console.log('\n\n');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}
