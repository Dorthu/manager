var webpack = require("webpack");
var path = require("path");
var CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    browsers: ['PhantomJS'],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'test/index.js',
      'test/setup.js'
    ],
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
      'src/**/*.js': ['webpack', 'sourcemap'],
      'test/setup.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.jsx?/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            include: [
              path.join(__dirname, 'src'),
              path.join(__dirname, 'test')
            ]
          },
          {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
          },
          {
            test: /\.jsx?/,
            include: path.join(__dirname, 'src'),
            loader: 'isparta'
          },
          {
            test: /\.svg$/,
            loaders: ['file'],
            include: path.join(__dirname, 'node_modules')
          }
        ]
      },
      sassLoader: {
        includePaths: [path.resolve(__dirname, "./node_modules/bootstrap/scss/")]
      },
      externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      plugins: [
        new webpack.DefinePlugin({
          ENV_API_ROOT: null,
          ENV_LOGIN_ROOT: null,
          ENV_APP_ROOT: null,
          ENV_GA_ID: null
        }),
        new CircularDependencyPlugin({
          failOnError: true,
          exclude: /node_modules/,
        })
      ]
    },
    webpackMiddleware: {
      stats: {
        colors: true
      },
      noInfo: true
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.'
    },
    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-spec-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-chrome-launcher"),
      require("karma-sourcemap-loader"),
      require("karma-coverage")
    ],
    browserNoActivityTimeout: 100000
  });
};
