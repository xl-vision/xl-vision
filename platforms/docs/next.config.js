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
      styledComponents: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      typedRoutes: false,
    },
    webpack: (config, { defaultLoaders }) => {
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
      });

      return config;
    },
  };
  return withBundleAnalyzer(nextConfig);
};
