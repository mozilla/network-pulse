var webpack = require(`webpack`);

module.exports = {
  context: `${__dirname}`,
  entry: `./main.jsx`,
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
        use: [
          {
            loader: `babel-loader`,
            options: {
              presets: [`es2015`, `react`]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': process.env.NODE_ENV || 'development'
      }
    })
  ]
};
