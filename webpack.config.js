const path = require('path');
const APPDIR = 'src/';
const devMode = process.env.NODE_ENV !== 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, APPDIR, 'index.html'),
  filename: 'index.html',
  inject: 'body'
});
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  context: path.resolve(__dirname, APPDIR),
  mode: 'production', // development, production
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
        test: /\.css|\.scss|\.sass$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode === 'development',
            },
          },
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
    HTMLWebpackPluginConfig,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
  ],
};