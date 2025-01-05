/* eslint-disable import/no-extraneous-dependencies */
const rehypePrism = require('@mapbox/rehype-prism');
const bundleAnalyzer = require('@next/bundle-analyzer');
const path = require('path');
const demoPlugin = require('./scripts/webpack/mdx/demoPlugin');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = async () => {
  const remarkGfm = (await import('remark-gfm')).default;
  const remarkEmoji = (await import('remark-emoji')).default;

  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    reactStrictMode: true,
    compiler: {
      // styledComponents: true,
      // emotion: {
      //   importMap: {
      //     '@xl-vision/react': {
      //       styled: {
      //           canonicalImport: ['@xl-vision/styled-engine', 'styled'],
      //           styledBaseImport: ['@xl-vision/react/styles', 'styled'],
      //       },
      //     },
      //     '@xl-vision/styled-engine': {
      //       styled: {
      //         canonicalImport: ['@emotion/styled', 'default'],
      //         styledBaseImport:  ['@xl-vision/styled-engine/styled', 'default'],
      //       }
      //     }
      //   }
      // }
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      typedRoutes: false,
    },
    // pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    webpack: (config, { defaultLoaders }) => {
      // config.resolve.alias = {
      //   ...config.resolve.alias,
      // }
      config.module.rules.unshift({
        test: /\.mdx?$/,
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
                  providerImportSource: '@mdx-components',
                  rehypePlugins: [rehypePrism],
                  remarkPlugins: [remarkGfm, remarkEmoji, demoPlugin],
                },
              },
            ],
            resolve: {
              alias: {
                '@mdx-components': path.resolve(__dirname, 'src/components/Markdown'),
              },
            },
          },
        ],
        resolve: {
          alias: {
            'react-dom': 'next/dist/compiled/react-dom',
            react: 'next/dist/compiled/react',
          },
        },
      });

      return config;
    },
  };
  return withBundleAnalyzer(nextConfig);
};
