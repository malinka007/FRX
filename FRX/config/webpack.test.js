const helpers = require('./helpers');
const path = require('path');

const DefinePlugin = require('webpack/lib/DefinePlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = function () {
  return {
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [ path.resolve(__dirname, 'src'), 'node_modules' ]

    },
    module: {

      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            // these packages have problems with their sourcemaps
            helpers.root('node_modules/rxjs'),
            helpers.root('node_modules/@angular')
          ]
        },
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          query: {
            // use inline sourcemaps for "karma-remap-coverage" reporter
            sourceMap: false,
            inlineSourceMap: true,
            compilerOptions: {
              removeComments: true

            }
          },
          exclude: [/\.e2e\.ts$/]
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
          exclude: [helpers.root('src/index.html')]
        },
        {
          test: /\.css$/,
          loader: ['to-string-loader', 'css-loader'],
          exclude: [helpers.root('src/index.html')]
        },
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        },
        {
          enforce: 'post',
          test: /\.(js|ts)$/,
          loader: 'istanbul-instrumenter-loader',
          include: helpers.root('src'),
          exclude: [
            /\.(e2e|spec)\.ts$/,
            /node_modules/
          ]
        }

      ]
    },
    plugins: [
      new DefinePlugin({
        'ENV': JSON.stringify(ENV),
        'process.env': {
          'ENV': JSON.stringify(ENV),
          'NODE_ENV': JSON.stringify(ENV)
        }
      }),
      new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        helpers.root('src')
      )
    ],
    node: {
      global: true,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
};
