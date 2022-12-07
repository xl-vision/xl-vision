const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const semver = require('semver');

async function run() {
  const cwd = process.cwd();
  const basePackagePath = path.resolve(cwd, 'package.json');

  const baseVersion = (await fs.readJSON(basePackagePath)).version;

  const nextVersion = semver.inc(baseVersion, 'prerelease');

  const paths = await findPackageJsons(cwd);

  paths.push(basePackagePath);

  const promises = [];

  paths.forEach((it) => {
    const p = fs.readJSON(it).then((json) =>
      fs.writeJSON(
        it,
        { ...json, version: nextVersion },
        {
          spaces: 2,
          EOL: '\n',
        },
      ),
    );
    promises.push(p);
  });

  await Promise.all(promises);
}

function findPackageJsons(cwd) {
  return new Promise((resolve, reject) => {
    glob(
      '+(packages|platforms)/*/package.json',
      {
        cwd,
        dot: true,
      },
      (err, matches) => {
        if (err) {
          return reject(err);
        }
        resolve(matches);
      },
    );
  });
}

run();
