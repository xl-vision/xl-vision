const rehypePrism = require('@mapbox/rehype-prism');
const bundleAnalyzer = require('@next/bundle-analyzer');
const path = require('node:path');
const demoPlugin = require('./scripts/webpack/mdx/demoPlugin');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = async () => {
  const { default: remarkGfm } = await import('remark-gfm');
  const { default: remarkEmoji } = await import('remark-emoji');

  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      typedRoutes: false,
      typedEnv: true,
    },
    webpack: (config, { defaultLoaders }) => {
      // const isStyledComponents = process.env.STYLE_LIB === 'styled-components';
      // if (isStyledComponents) {
      //   config.resolve.alias['@xl-vision/styled-engine'] = '@xl-vision/styled-engine-sc';
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
module.exports = nextConfig;
