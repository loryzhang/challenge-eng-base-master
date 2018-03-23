const path = require('path');

const SRC_DIR = path.join(__dirname, '/src/');
const DIST_DIR = path.join(__dirname, '/public/');

module.exports = {
  entry: ['babel-polyfill', `${SRC_DIR}index.js`],
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
};
