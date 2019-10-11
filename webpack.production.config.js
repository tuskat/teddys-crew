let path = require('path')
let webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

// Phaser webpack config
let pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
let phaser = path.join(pathToPhaser, 'dist/phaser.js');

let definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
  WEBGL_RENDERER: true, // I did this to make webpack work, but I'm not really sure it should always be true
  CANVAS_RENDERER: true // I did this to make webpack work, but I'm not really sure it should always be true
})
process.env.TARGET = 'electron';
module.exports = {
  entry: {
    app: [
      './src/games/cadre-de-guerre/game.ts',
    ],
    interface: [
      'vue',
      './interface/app.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: '[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './production.html',
      chunks: ['interface', 'vue', 'app'],
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
    new ScriptExtHtmlWebpackPlugin({
      sync: ['vue'],
      async: ['interface'],
      defer: ['app']
    }),
    new CopyWebpackPlugin([
      { from: 'src/games/cadre-de-guerre/assets', to: 'assets' },
      { from: 'styles', to: 'styles' }
    ]),
  ],
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' },
      { test: /\.vue$/, loader: 'vue-loader' },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader'
          },
        ],
      }
    ]
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]vue[\\/]/,
          name: "vue",
          chunks: "all"
        }
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser,
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  // to remove when real prod
  // devtool: 'source-map'
}
