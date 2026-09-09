const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = webpack.container;

dotenv.config({ path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`) });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const deps = require('./package.json').dependencies;
const PORT = 3003;

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';
  const publicPath = process.env.PUBLIC_PATH || `http://localhost:${PORT}/`;

  return {
    entry: './src/index.tsx',
    mode: argv.mode || 'development',
    devtool: isProduction ? false : 'eval-source-map',
    devServer: {
      port: PORT,
      historyApiFallback: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
    output: {
      publicPath,
      uniqueName: 'mfeOrders',
      clean: isProduction,
    },
    resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          exclude: /node_modules\/(?!@nisum-mfe)/,
          use: {
            loader: 'babel-loader',
            options: { configFile: path.resolve(__dirname, '../../babel.config.js') },
          },
        },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'mfeOrders',
        filename: 'remoteEntry.js',
        exposes: {
          './OrdersApp': './src/App',
        },
        shared: {
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
          'react-redux': { singleton: true, requiredVersion: deps['react-redux'] },
          '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
          '@nisum-mfe/state': { singleton: true, requiredVersion: deps['@nisum-mfe/state'] },
          '@nisum-mfe/events': { singleton: true, requiredVersion: deps['@nisum-mfe/events'] },
        },
      }),
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:4000'),
      }),
    ],
  };
};
