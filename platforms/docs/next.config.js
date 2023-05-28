/* eslint-disable import/no-extraneous-dependencies */
const rehypePrism = require('@mapbox/rehype-prism');
const bundleAnalyzer = require('@next/bundle-analyzer');
// const fs = require('fs-extra');
const path = require('path');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
const demoPlugin = require('./scripts/webpack/mdx/demoPlugin');

module.exports = async () => {
  const remarkGfm = (await import('remark-gfm')).default;
  const remarkEmoji = (await import('remark-emoji')).default;

  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
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
    experimental: {
      typedRoutes: true,
      esmExternals: true,
      externalDir: true,
    },
    webpack: (config, { defaultLoaders }) => {
      // const alias = resolvePackageAlias();

      config.resolve.alias = {
        ...config.resolve.alias,
        // ...alias,
        // '$react': path.resolve(__dirname, './node_modules/react'),
        // '$react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        // 'styled-components': path.resolve(__dirname, './node_modules/styled-components'),
        '@mdx-js/react': path.resolve(__dirname, './node_modules/@mdx-js/react'),
      };

      config.module.rules.push({
        test: /\.mdx?$/,
        exclude: /node_modules/,
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
                  jsx: true,
                  providerImportSource: '@mdx-js/react',
                  rehypePlugins: [rehypePrism],
                  remarkPlugins: [remarkGfm, remarkEmoji, demoPlugin],
                },
              },
            ],
          },
        ],
      });

      return config;
    },
  };
  return withBundleAnalyzer(nextConfig);
};

// function resolvePackageAlias() {
//   const basePath = path.join(__dirname, '../../packages');

//   const files = fs.readdirSync(basePath);

//   const packageNames = files
//     .map((it) => path.join(basePath, it, 'package.json'))
//     .map((it) => {
//       const exist = fs.pathExistsSync(it);
//       if (!exist) {
//         return;
//       }
//       const json = fs.readJSONSync(it);
//       const { name } = json;
//       return name;
//     });

//   const srcExists = files
//     .map((it) => path.join(basePath, it, 'src'))
//     .map((it) => fs.pathExistsSync(it));

//   const aliasMap = {};
//   for (let i = 0; i < files.length; i++) {
//     if (packageNames[i] && srcExists[i]) {
//       aliasMap[packageNames[i]] = path.join(basePath, files[i], 'src');
//     }
//   }
//   return aliasMap;
// }
