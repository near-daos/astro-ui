const path = require('path');
const svgSprite = require('./plugins/next-svg-sprites');
const cssLoaderConfig = require('./plugins/css-loader-config');
const { i18n } = require('./next-i18next.config');

module.exports = (phase, { defaultConfig }) => {
  const plugins = [svgSprite, cssLoaderConfig];

  const transformers = [];
  const nextConfig = plugins.reduce(
    (acc, next) => {
      const nextConfig = next(acc);
      if (typeof nextConfig.webpack === 'function') {
        transformers.push(nextConfig.webpack);
      }

      return nextConfig;
    },
    {
      ...defaultConfig,
      reactStrictMode: true,
      images: {
        domains: [
          'i.imgur.com',
          'sputnik-dao.s3.eu-central-1.amazonaws.com',
          'ipfs.io',
          'ipfs.fleek.co',
          'cloudflare-ipfs.com',
        ],
      },
      sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
      },
      async rewrites() {
        return [
          {
            source: '/create-dao',
            destination: '/create-dao/foundation',
          },
        ];
      },
      target: 'experimental-serverless-trace',
      i18n,
    }
  );

  nextConfig.webpack = (config, options) => {
    config.externals = [...config.externals, 'bufferutil', 'utf-8-validate'];

    return transformers.reduce((acc, next) => next(acc, options), config);
  };

  return nextConfig;
};
