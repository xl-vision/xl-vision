/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs-extra');
const { merge } = require('webpack-merge');

module.exports = () => {
  return {
    eslint: {
      ignoreDuringBuilds: true,
    },
    i18n: {
      locales: ['en-US', 'zh-CN'],
      defaultLocale: 'en-US',
    },
    reactStrictMode: true,
    webpack: (config, { defaultLoaders }) => {
      const alias = resolvePackageAlias();
      config.module.rules[1].include.push(path.join(__dirname, '../../packages'));

      return merge(config, {
        resolve: {
          alias: {
            ...alias,
            react: path.join(__dirname, '../../node_modules/react'),
            'react-dom': path.join(__dirname, '../../node_modules/react-dom'),
            'styled-components': path.join(__dirname, '../../node_modules/styled-components'),
          },
        },
        module: {
          rules: [
            {
              test: [/\.mdx?$/],
              exclude: '/node_modules/',
              use: [
                defaultLoaders.babel,
                {
<<<<<<< HEAD
                  loader: require.resolve('./scripts/webpack/mdLoader'),
=======
                  loader: require.resolve('./scripts/mdLoader'),
>>>>>>> docs: working on ssr
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
