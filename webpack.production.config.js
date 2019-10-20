let path = require('path');
let webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

// Phaser webpack config
let pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
let phaser = path.join(pathToPhaser, 'dist/phaser.js');


module.exports = env => {
  return {
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
      new webpack.DefinePlugin({
        TARGET: JSON.stringify('electron'),
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './production.html',
        chunks: ['interface', 'vue'],
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
        async: ['interface']
      }),
      new CopyWebpackPlugin([
        { from: 'src/games/cadre-de-guerre/assets', to: 'assets' },
        { from: 'styles', to: 'styles' }
      ]),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css'
      })
    ],
    module: {
      rules: [
        { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
        { test: /phaser\.js$/, loader: 'expose-loader?Phaser' },
        { test: /\.vue$/, loader: 'vue-loader' },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'sass-loader'
          ],
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: true,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/](vue|vuex)[\\/]/,
            name: "vue",
            chunks: "all"
          },
            styles: {
              test: /\.css$/,
              name: 'styles',
              chunks: 'all',
              enforce: true
          }
        }
      }
    },
    resolve: {
      extensions: ['.ts', '.js', 'scss'],
      alias: {
        phaser: phaser,
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    // to remove when real prod
    // devtool: 'source-map'
  }
}
