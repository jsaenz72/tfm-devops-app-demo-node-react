const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    // Carga variables desde .env (opcional, pero útil)
    new Dotenv({ systemvars: true }),
    // Inyecta una constante global para evitar process en el navegador
    new webpack.DefinePlugin({
      __API_URL__: JSON.stringify(process.env.API_URL || 'http://localhost:3030')
    })
  ],
  devServer: { historyApiFallback: true }
};
