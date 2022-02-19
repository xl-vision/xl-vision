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

function createChangelog(cwd, prevVersion) {
  return new Promise((resolve, reject) => {
    conventionalChangelog(
      {
        preset: 'angular',
      },
      {
        previousTag: `v${prevVersion}`,
      },
    )
      .pipe(
        fs.createWriteStream(path.resolve(cwd, 'CHANGELOG.md'), {
          flags: 'r+',
        }),
      )
      .on('error', reject)
      .on('finish', resolve);
  });
}

async function createReleasePR(releaseType) {
  const githubToken = process.env.github.token;
  const git = simpleGit({
    config: [
      `Authorization: token ${githubToken}`,
      'user.email=github-actions[bot]@users.noreply.github.com',
      'user.name=github-actions[bot]',
    ],
  });

  releaseType = releaseType || process.env.RELEASE_TYPE;

  const cwd = process.cwd();

  const basePackagePath = path.resolve(cwd, 'package.json');

  const basePackageJson = await fs.readJSON(basePackagePath);

  const baseVersion = basePackageJson.version;

  const nextVersion = semver.inc(baseVersion, releaseType);

  const files = await findPackages(cwd);

  files.push(basePackagePath);

  let promise = Promise.resolve();

  files.forEach((file) => {
    const filePath = path.resolve(cwd, file);
    promise = promise
      .then(() => fs.readJSON(filePath))
      .then((packageJson) => {
        packageJson.version = nextVersion;
        return fs.writeJSON(filePath, packageJson, {
          spaces: 2,
          EOL: '\n',
        });
      });
  });

  await promise;

  await createChangelog(cwd, baseVersion);

  await git.add('.');

  await git.commit(`chore: bump version to v${nextVersion}`, ['-n']);

  await git.push('origin', `version/${releaseType}`, ['--force']);
}

createReleasePR();
