const path = require('path');

const SRC_DIR = path.join(__dirname, '/src/');
const DIST_DIR = path.join(__dirname, '/public/');

module.exports = {
  entry: ['babel-polyfill', `${SRC_DIR}index.jsx`,  `${SRC_DIR}style.less`],
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, './public/'),
    port: 3000,
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
        test: /\.less$/,
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            javascriptEnabled: true,
          },
        }],
      },
    ],
  },
};
