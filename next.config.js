const path = require('path');
const withPlugins = require('next-compose-plugins');
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
      sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
      }
    }
  );

  nextConfig.webpack = (config, options) =>
    transformers.reduce((acc, next) => next(acc, options), config);

  return nextConfig;
};
