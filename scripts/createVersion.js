/* eslint-disable no-console */
const semver = require('semver');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const { default: simpleGit } = require('simple-git');
const conventionalChangelog = require('conventional-changelog');
const { Octokit, App } = require('octokit');

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

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

function createChangelog(prevVersion) {
  const stream = conventionalChangelog(
    {
      preset: 'angular',
    },
    {
      previousTag: `v${prevVersion}`,
    },
  );

  return streamToString(stream);
}

async function createReleasePR(releaseType) {
  const token = process.env.TOKEN;
  const git = simpleGit({
    config: [
      `Authorization: token ${token}`,
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

  console.log(`\nchange package.json version from '${baseVersion}' to '${nextVersion}'\n`);

  const content = await createChangelog(baseVersion);

  await fs.writeFile(path.resolve(cwd, 'CHANGELOG.md'), content, {
    encoding: 'utf8',
    flag: 'r+',
  });

  console.log(`\ncreate changelog\n`);

  await git.add('.');

  await git.commit(`chore: bump version to v${nextVersion}`, ['-n']);

  await git.push('origin', `version/${releaseType}`, ['--force']);

  const octokit = new Octokit({ auth: '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' });

  const res = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner: 'xl-vision',
    repo: 'xl-vision',
    base: 'master',
    state: 'open',
    head: `version/${releaseType}`,
  });

  const pullNumber = res.data.length ? res.data[0].number : null;

  const title = `chore(${releaseType}): bump to v${nextVersion}`;

  const newContent = `### Changelogs\n\n${content}`;

  if (pullNumber !== null) {
    await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: 'xl-vision',
      repo: 'xl-vision',
      pull_number: pullNumber,
      title,
      body: newContent,
      state: 'open',
    });
  } else {
    await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner: 'xl-vision',
      repo: 'xl-vision',
      head: `version/${releaseType}`,
      base: 'master',
      title,
      body: newContent,
    });
  }
}

createReleasePR();
