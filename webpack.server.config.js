var fs = require(`fs`);
var path = require(`path`);

module.exports = {
  context: `${__dirname}`,
  entry: path.resolve(__dirname, `server.js`),
  output: {
    path: `${__dirname}/dist`,
    filename: `server.bundle.js`,
    publicPath: `/`
  },
  target: `node`,
  // keep node_module paths out of the bundle
  // copied from https://github.com/reactjs/react-router-tutorial/tree/master/lessons/13-server-rendering
  externals: fs.readdirSync(path.resolve(__dirname, `node_modules`)).concat([
    `react-dom/server`, `react/addons`,
  ]).reduce((ext, mod) => {
    ext[mod] = `commonjs ` + mod;
    return ext;
  }, {}),
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: `babel-loader`,
        exclude: /node_modules/,
        query: {
          presets: [`es2015`, `react`]
        }
      },
      {
        test: /\.json$/,
        loader: `json`
      }
    ]
  }
};
