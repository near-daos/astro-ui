const path = require('path');
const { extendDefaultPlugins } = require('svgo');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
  core: {
    builder: 'webpack5',
  },

  webpackFinal: async (config, { configType }) => {
    const allowedColors = [
      'none',
      'white',
      '#fff',
      '#ffffff',
      'rgb(255, 255, 255)',
    ];
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve('./'),
    ];

    config.stats = {
      errorDetails: true, // --display-error-details
    };

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            localsConvention: 'camelCase',
            modules: true,
          },
        },
        'sass-loader',
      ],
      include: path.resolve(__dirname, '../'),
    });

    // Disable svg processing by all default modules
    config.module.rules = config.module.rules.map(rule => {
      if (rule.test && rule.test.toString().includes('svg')) {
        const test = rule.test
          .toString()
          .replace('svg|', '')
          .replace(/\//g, '');
        return {
          ...rule,
          test: new RegExp(test),
        };
      } else {
        return rule;
      }
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-sprite-loader',
          options: {
            extract: true,
            publicPath: 'static/',
            outputPath: '_next/static/',
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.svg$/,
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
      use: [
        {
          loader: 'svgo-loader',
        },
      ],
    });

    config.plugins.push(new SpriteLoaderPlugin());

    config.resolve.alias = {
      ...config.resolve.alias,
      'next-i18next': 'react-i18next',
    };

    // Return the altered config
    return config;
  },
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    'storybook-addon-next-router',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
  ],
};
