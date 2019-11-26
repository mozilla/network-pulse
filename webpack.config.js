var webpack = require(`webpack`);

console.log(`\n\n\nbundling for ${process.env.NODE_ENV}.\n\n\n`);

console.log(process.env);

module.exports = env => {
  console.log(env);

  return {
    mode: process.env.NODE_ENV === `production` ? `production` : `development`,
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
};
