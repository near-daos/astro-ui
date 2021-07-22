const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const path = require('path');
const { extendDefaultPlugins } = require('svgo');

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    target: 'serverless',
    reactStrictMode: true,
    webpack: (config, options) => {
      const allowedColors = [
        'none',
        'white',
        '#fff',
        '#ffffff',
        'rgb(255, 255, 255)'
      ];
      config.module.rules.push({
        test: /\.svg$/,
        include: path.join(process.cwd(), 'assets', 'icons'),

        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              publicPath: 'static/'
            }
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: extendDefaultPlugins([
                {
                  name: 'convertColors',
                  params: {
                    currentColor: {
                      exec: val => !allowedColors.includes(val)
                    }
                  }
                }
              ])
            }
          }
        ]
      });
      config.plugins.push(new SpriteLoaderPlugin());

      return config;
    }
  });
};
