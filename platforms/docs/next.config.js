/* eslint-disable import/no-extraneous-dependencies */
const rehypePrism = require('@mapbox/rehype-prism');
const bundleAnalyzer = require('@next/bundle-analyzer');

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
    experimental: {
      typedRoutes: false,
      esmExternals: true,
      externalDir: true,
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
