let path = require('path');
let webpack = require('webpack');
let pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
let phaser = path.join(pathToPhaser, 'dist/phaser.js');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = env => {
  return {
    entry: ['./src/games/cadre-de-guerre/game.ts', './interface/app.js'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
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
    devServer: {
      contentBase: path.resolve(__dirname, './'),
      publicPath: '/dist/',
      host: '127.0.0.1',
      port: 8080,
      open: true
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        phaser: phaser,
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        TARGET: JSON.stringify('web'),
      })
    ]
  };
}