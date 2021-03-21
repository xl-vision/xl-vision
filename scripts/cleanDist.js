const fs = require('fs-extra');
const path = require('path');

const resolve = (...dir) => path.resolve(__dirname, '..', ...dir);

async function clean() {
  await fs.remove(resolve('packages/styled-engine/legacy'));
  await fs.remove(resolve('packages/styled-engine/modern'));
  await fs.remove(resolve('packages/icons/legacy'));
  await fs.remove(resolve('packages/icons/modern'));
  await fs.remove(resolve('packages/react/legacy'));
  await fs.remove(resolve('packages/react/modern'));
  await fs.remove(resolve('platforms/docs/dist'));
}

clean();
