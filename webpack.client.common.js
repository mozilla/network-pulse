module.exports = {
  context: `${__dirname}`,
  entry: `./app.jsx`,
  output: {
    path: `${__dirname}/dist`,
    filename: `bundle.js`,
    publicPath: `/`
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: [`babel-loader`, `document-env-vars`]
      }
    ]
  }
};
