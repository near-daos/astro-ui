const path = require('path');
const withPlugins = require('next-compose-plugins');
const svgSprite = require('./plugins/next-svg-sprites');

module.exports = withPlugins([svgSprite], {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  }
});
