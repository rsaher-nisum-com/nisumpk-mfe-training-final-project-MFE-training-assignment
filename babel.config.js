// Shared by every app's webpack.config.js (see `babel-loader` rule -> configFile).
// Keeping one babel config avoids repeating the same preset list four times.
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { esmodules: true } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
};
