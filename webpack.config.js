const path = require('path');
const APPDIR = 'src/';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = env => {

  console.log('NODE_ENV: ', env.NODE_ENV); // 'dev' or production
  const devMode = env.NODE_ENV !== 'production';

  return {
    context: path.resolve(__dirname, APPDIR),
    entry: {
      index: './js/index.js',
    },
    devtool: 'source-map',
    devServer: {
      contentBase: './dist',
      hot: true
    },
    output: {
      filename: devMode ? '[name].js' : '[name].[hash].js',
      chunkFilename: devMode ? '[id].js' : '[id].[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },    
    module: {
      rules: [{
          test: /\.css|\.scss|\.sass$/,
          use: [{
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: devMode,
              },
            },            
            'css-loader',
            'sass-loader',
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'img/'
            }
          }]
        },
        {
          test: /\.(ogg|mp3|wav|mpe)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'songs/'
            }
          }]
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, APPDIR, 'index.html'),
        filename: 'index.html',
        inject: 'body'
      }),
      new MiniCssExtractPlugin({        
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css\.*(?!.*map)/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      })
    ],
  }
};