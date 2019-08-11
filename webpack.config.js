const path = require('path');
const APPDIR = 'src/';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, APPDIR, 'index.html'),
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  context: path.resolve(__dirname, APPDIR),
  mode: 'development',
  entry: {
    index: './js/index.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
        test: /\.css|\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img/'
            }
          }          
        ]
      },
      {
        test: /\.(ogg|mp3|wav|mpe)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'songs/'
            }
          }          
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    HTMLWebpackPluginConfig
  ],
};