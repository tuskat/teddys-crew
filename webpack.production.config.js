let path = require('path')
let webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin')
let CopyWebpackPlugin = require('copy-webpack-plugin')

// Phaser webpack config
let pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
let phaser = path.join(pathToPhaser, 'dist/phaser.js');

let definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
  WEBGL_RENDERER: true, // I did this to make webpack work, but I'm not really sure it should always be true
  CANVAS_RENDERER: true // I did this to make webpack work, but I'm not really sure it should always be true
})

module.exports = {
  entry: {
    app: [
      './src/games/cadre-de-guerre/game.ts'
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: 'bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
      hash: true
    }),
    new CopyWebpackPlugin([
      { from: 'src/games/cadre-de-guerre/assets', to: 'assets' },
      { from: 'styles', to: 'styles' }
    ]), 
  ],
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
    ]
  },
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser
    }
  }
}