const fs = require('fs-extra');
const path = require('path');

async function clean() {
  const basePath = path.join(__dirname, '../packages');
  const files = await fs.readdir(basePath);

  const promises = files.map((it) => {
    return fs.remove(path.join(basePath, it, 'legacy')).then(() => {
      fs.remove(path.join(basePath, it, 'modern'));
    });
  });

  return Promise.all(promises);
}

clean();
