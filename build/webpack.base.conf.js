var path = require('path'),webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/static'),
    publicPath: '/static/',
    filename: '[name].js'
  },
  // plugins: [new webpack.optimize.UglifyJsPlugin({minimize: true})],
  resolve: {
    extensions: ['', '.js', '.vue'],
    alias: {
      'src': path.resolve(__dirname, '../src')
    }
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel!eslint',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash:7]'
        }
      },
      {test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      {test: /\.(woff|woff2)$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      {test: /\.ttf$/,    loader: "file-loader" },
      {test: /\.eot$/,    loader: "file-loader" },
      {test: /\.svg$/,    loader: "file-loader" }
    ],
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false
  },
  vue: {
    loaders: {
      js: 'babel!eslint'
    }
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  node: {
    net: "empty",
    tls: "empty",
    fs: "empty",
    json: "empty"
  }
}
