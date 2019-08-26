const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/canvas.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: "babel-loader" }
        ]
      },
      {
        test: /\.html$/,
        use: [
          { loader: "html-loader" }
        ]
      },
      {
        test: /\.(png|svg|jpeg|gif)$/,
        use: [
          "file-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
}