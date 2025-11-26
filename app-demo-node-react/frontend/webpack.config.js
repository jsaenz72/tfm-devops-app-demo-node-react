const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.jsx'),
  output: { path: path.resolve(__dirname, 'dist'), filename: 'bundle.js', clean: true },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [ new HtmlWebpackPlugin({ template: './src/index.html' }) ],
  devServer: { historyApiFallback: true }
};
