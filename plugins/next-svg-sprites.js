const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const path = require('path');
const { extendDefaultPlugins } = require('svgo');

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    // target: 'serverless',
    reactStrictMode: true,
    webpack: (config, options) => {
      const allowedColors = [
        'none',
        'white',
        '#fff',
        '#ffffff',
        'rgb(255, 255, 255)',
      ];
      config.module.rules.push({
        test: /\.svg$/,
        include: path.join(process.cwd(), 'assets', 'icons'),

        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              publicPath: 'static/',
              outputPath: 'static/',
            },
          },
        ],
      });
      config.module.rules.push({
        test: /\.svg$/,
        include: path.join(process.cwd(), 'assets', 'icons'),
        exclude: /\.colors\.svg$/,

        use: [
          {
            loader: 'svgo-loader',
            options: {
              // TODO // We should get rid of this. It processes all icons and replaces
              // TODO // colors even where we should keep them (e.g. colorful icons).
              plugins: extendDefaultPlugins([
                {
                  name: 'convertColors',
                  params: {
                    currentColor: {
                      exec: val => !allowedColors.includes(val),
                    },
                  },
                },
              ]),
            },
          },
        ],
      });

      config.module.rules.push({
        test: /\.colors\.svg$/,
        include: path.join(process.cwd(), 'assets', 'icons'),
        use: [
          {
            loader: 'svgo-loader',
          },
        ],
      });

      config.plugins.push(new SpriteLoaderPlugin());

      return config;
    },
  });
};
