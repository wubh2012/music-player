const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/js/index.js',
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.css|\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ]
    }]
  }
};