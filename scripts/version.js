const semver = require('semver');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const { default: simpleGit } = require('simple-git');
const conventionalChangelog = require('conventional-changelog');

function findPackages(cwd) {
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

async function createReleasePR(releaseType) {
  const git = simpleGit({
    config: [
      'user.email=github-actions[bot]@users.noreply.github.com',
      'user.name=github-actions[bot]',
    ],
  });

  releaseType = releaseType || process.env.RELEASE_TYPE;

  const cwd = process.cwd();
  const basePackageJson = await fs.readJSON(path.resolve(cwd, 'package.json'));

  const baseVersion = basePackageJson.version;

  const nextVersion = semver.inc(baseVersion, releaseType);

  const files = await findPackages(cwd);

  let promise = Promise.resolve();

  files.forEach((file) => {
    const filePath = path.resolve(cwd, file);
    promise = promise
      .then(() => fs.readJSON(filePath))
      .then((packageJson) => {
        packageJson.version = nextVersion;
        return fs.writeJSON(filePath, packageJson);
      });
  });

  await promise;

  conventionalChangelog({
    preset: 'angular',
  }).pipe(
    fs.createWriteStream(path.resolve(cwd, 'CHANGELOG.md'), {
      flags: 'r+',
    }),
  );

  await git.add('.');

  await git.commit(`chore: bump version to v${nextVersion}`);
}

createReleasePR();
