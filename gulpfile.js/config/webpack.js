var path            = require('path')
var paths           = require('./')
var webpack         = require('webpack')
var webpackManifest = require('../lib/webpackManifest')
var StatsPlugin     = require('stats-webpack-plugin');

module.exports = function(env) {
  var jsSrc = path.resolve(paths.sourceAssets + '/javascripts/')
  var jsDest = paths.publicAssets + '/javascripts/'
  var publicPath = 'assets/javascripts/'

  var webpackConfig = {

    context: jsSrc,

    node: {
      fs: "empty",
      net: "empty",
      tls: "empty",
      console: true
    },

    plugins: [],

    resolve: {
      alias: {
        styles : path.resolve(paths.sourceAssets + '/stylesheets/'),
        models: path.resolve(paths.sourceAssets + '/javascripts/models/'),
        conf: path.resolve(paths.sourceAssets + '/javascripts/configuration/'),
        operations: path.resolve(paths.sourceAssets + '/javascripts/operations/')
      },
      extensions: ['', '.js', '.less']
    },

    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel-loader?stage=1', exclude: /node_modules/ },
        { test: /\.less$/, loader: "style!css!less" },
        { test: /\.json$/, loader: "json" },
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&minetype=application/font-woff" },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" }
      ]
    }
  }


  if(env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry= {
      app: [ './app.js' ]
    }

    webpackConfig.output= {
      path: jsDest,
      filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
      publicPath: publicPath
    }

    // Factor out common dependencies into a shared.js
    webpackConfig.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'shared',
        filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
      })
    )
  }

  if(env === 'development') {
    webpackConfig.devtool = 'source-map'
    webpack.debug = true
  }

  if(env === 'production') {
    webpackConfig.plugins.push(
      new webpackManifest(publicPath, 'public'),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new StatsPlugin('stats.json', {
        chunkModules: true,
        exclude: [/node_modules[\\\/]react/]
      }),
      new webpack.NoErrorsPlugin()
    )
  }

  return webpackConfig
}
