const path = require('path');
const svgSprite = require('./plugins/next-svg-sprites');
const cssLoaderConfig = require('./plugins/css-loader-config');

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
        domains: ['i.imgur.com', 'sputnik-dao.s3.eu-central-1.amazonaws.com']
      },
      sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
      },
      async rewrites() {
        return [
          {
            source: '/api-server/:path*',
            destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*' // Proxy to Backend
          },
          {
            source: '/create-dao',
            destination: '/create-dao/foundation'
          }
        ];
      }
    }
  );

  nextConfig.webpack = (config, options) =>
    transformers.reduce((acc, next) => next(acc, options), config);

  return nextConfig;
};
