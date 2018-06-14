const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'build/'),
    host: '0.0.0.0',
    hot: false,
    inline: false,
  },
  devtool: "eval",
});
