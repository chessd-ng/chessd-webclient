const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    register: './src/register/register.js',
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/register.html'),
      filename: 'register.html',
      chunks: ['register'],
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name]-[hash].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(xml)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]',
            }
          }
        ]
      },
    ]
  },
  resolve: {
    alias: {
      images: path.resolve(__dirname, 'images'),
      conf: path.resolve(__dirname, 'conf'),
      langs: path.resolve(__dirname, 'lang'),
    },
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ]
  }
};
