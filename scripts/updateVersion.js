const fs = require('fs-extra');
const path = require('node:path');
const semver = require('semver');

async function run() {
  const cwd = process.cwd();
  const basePackagePath = path.resolve(cwd, 'package.json');

  const { version: baseVersion } = await fs.readJSON(basePackagePath);

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
          EOL: '\n',
          spaces: 2,
        },
      ),
    );
    promises.push(p);
  });

  await Promise.all(promises);
}

async function findPackageJsons(cwd) {
  const glob = await import('glob');

  return glob.glob('+(packages|platforms)/*/package.json', {
    cwd,
    dot: true,
  });
}

run();
