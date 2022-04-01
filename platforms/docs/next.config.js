/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs-extra');
const { merge } = require('webpack-merge');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  outputFileTracing: false,
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

    config = merge(config, {
      resolve: {
        alias: {
          ...alias,
          '@mdx-js/react': require.resolve('@mdx-js/react'),
          react: path.resolve(__dirname, '../../node_modules/react'),
          'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
          'styled-components': path.resolve(__dirname, '../../node_modules/styled-components'),
        },
      },
      module: {
        rules: [
          {
            test: /\.mdx?$/,
            exclude: '/node_modules/',
            oneOf: [
              {
                resourceQuery: /locale/,
                use: [
                  defaultLoaders.babel,
                  {
                    loader: require.resolve('./scripts/webpack/localeLoader'),
                  },
                ],
              },
              {
                use: [
                  defaultLoaders.babel,
                  {
                    loader: require.resolve('@mdx-js/loader'),
                    /** @type {import('@mdx-js/loader').Options} */
                    options: {
                      remarkPlugins: [require('./scripts/webpack/mdx/demoPlugin')],
                    },
                  },
                ],
              },
            ],
          },
          {
            test: /\.(tsx|ts|js|jsx)$/,
            include: [path.join(__dirname, '../../packages')],
            exclude: /node_module/,
            use: defaultLoaders.babel,
          },
        ],
      },
    });

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);

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
