const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const path = require('path');

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    // target: 'serverless',
    reactStrictMode: true,
    webpack: (config, options) => {
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
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      // customize default plugin options
                      convertColors: {
                        currentColor: /^((?!(none|white|#fff|#ffffff)).)*$/,
                      },
                    },
                  },
                },
              ],
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
