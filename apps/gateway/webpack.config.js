const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = webpack.container;

dotenv.config({ path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`) });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const deps = require('./package.json').dependencies;
const PORT = 3000;

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';

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
      publicPath: process.env.PUBLIC_PATH || `http://localhost:${PORT}/`,
      uniqueName: 'gateway',
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
        name: 'gateway',
        remotes: {
          // Never hardcoded further than this - all resolved from env at build time (see .env.example).
          mfeProduct: `mfeProduct@${process.env.PRODUCT_MFE_URL || 'http://localhost:3001'}/remoteEntry.js`,
          mfeCart: `mfeCart@${process.env.CART_MFE_URL || 'http://localhost:3002'}/remoteEntry.js`,
          mfeOrders: `mfeOrders@${process.env.ORDERS_MFE_URL || 'http://localhost:3003'}/remoteEntry.js`,
        },
        shared: {
          react: { singleton: true, requiredVersion: deps.react },
          'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
          'react-redux': { singleton: true, requiredVersion: deps['react-redux'] },
          '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
          'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
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
