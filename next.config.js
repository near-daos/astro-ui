const path = require('path');
const withPlugins = require('next-compose-plugins');
const withSvgr = require('next-plugin-svgr');

module.exports = withPlugins(
  [
    [
      withSvgr,
      {
        fileLoader: true,
        svgrOptions: {
          titleProp: true,
          icon: true,
          svgProps: {
            height: 'auto'
          }
        }
      }
    ]
  ],
  {
    reactStrictMode: true,
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')]
    }
  }
);
