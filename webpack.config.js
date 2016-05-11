var webpack = require('webpack');

module.exports = {
  context: __dirname + '/public',
  entry: {
    javascript: './js/app.jsx'
    // html: './views/index.html'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },
  // ファイル名解決のための設定
  resolve: {
    extensions: ['', '.js', '.jsx'] // 拡張子を省略できるようにする
  },  
  devtool: 'inline-source-map',
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      },      
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  }
};
