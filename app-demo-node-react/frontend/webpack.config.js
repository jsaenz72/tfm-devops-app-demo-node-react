const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
require('dotenv').config(); // 👈 Permite que webpack lea el .env en Node

// 👇 Mostrar variable al iniciar la configuración
console.log("=================================");
console.log("🚀 API_URL cargada:", process.env.API_URL);
console.log("=================================");

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/', // importante para React Router
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // Carga variables desde .env o desde docker-compose
    new Dotenv({ systemvars: true }),
    // Inyecta una constante global para usar en el frontend
    new webpack.DefinePlugin({
      __API_URL__: JSON.stringify(process.env.API_URL || 'http://localhost:3030'),
    }),
  ],
  devServer: {
    port: 5173,          //  puerto expuesto en docker-compose
    host: '0.0.0.0',     //  necesario para que se escuche fuera del contenedor
    historyApiFallback: true, // soporte para React Router
    hot: true,           // recarga en caliente
    compress: true,      // gzip
    client: {
      overlay: true,     // muestra errores en pantalla
    },
  },
};
