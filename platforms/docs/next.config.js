/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs-extra');
const { merge } = require('webpack-merge');

module.exports = () => {
  return {
    webpack: (config, options) => {
      const alias = resolvePackageAlias();
      return merge(config, {
        resolve: {
          alias,
        },
        module: {
          rules: [
            {
              test: [/\.mdx?$/],
              exclude: '/node_modules/',
              use: [
                options.defaultLoaders.babel,
                {
                  loader: require.resolve('./scripts/webpack/mdLoader'),
                },
              ],
            },
          ],
        },
      });
    },
  };
};

function resolvePackageAlias() {
  const basePath = path.join(__dirname, '../../packages');

  const files = fs.readdirSync(basePath);

  const packageNames = files
    .map((it) => path.join(basePath, it, 'package.json'))
    .map((it) => {
      const exist = fs.pathExistsSync(it);
      if (!exist) {
        return;
      }
      const json = fs.readJSONSync(it);
      const { name } = json;
      return name;
    });

  const srcExists = files
    .map((it) => path.join(basePath, it, 'src'))
    .map((it) => fs.pathExistsSync(it));

  const aliasMap = {};
  for (let i = 0; i < files.length; i++) {
    if (packageNames[i] && srcExists[i]) {
      aliasMap[packageNames[i]] = path.join(basePath, files[i], 'src');
    }
  }
  return aliasMap;
}
