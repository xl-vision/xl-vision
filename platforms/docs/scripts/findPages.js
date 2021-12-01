const path = require('path');
const fs = require('fs-extra');
const { func } = require('prop-types');

const pageDir = path.join(__dirname, '../src/pages');

async function findFiles(baseDir = pageDir) {
  const names = await fs.readdir(baseDir);
  const paths = names.map((item) => path.resolve(baseDir, item));

  const promises = paths.map((it) => {
    return fs.stat(it).then((s) => {
      if (s.isDirectory()) {
        return findFiles(it);
      }
      return it;
    });
  });

  const result = await Promise.all(promises);

  return result.flat();
}

const ignoreFiles = ['/_app', '/_document'];

async function findPages() {
  const paths = (await findFiles())
    .map((it) => {
      const p1 = path
        .relative(pageDir, it)
        .replace(new RegExp(`\\${path.sep}`, 'g'), '/')
        .replace('.tsx', '')
        .replace('.ts', '');
      return `/${p1}`.replace(/^\/index$/, '/').replace(/\/index$/, '');
    })
    .filter((it) => !ignoreFiles.includes(it));

  return paths;
}

module.exports = findPages;
