const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const path = require("path");

module.exports = {
  // defines environment (production or development) - tells webpack how to use its built-in optimizations
  mode: process.env.Node_ENV,

  // entry point of the app
  entry: {
    src: "./client/index.js",
  },

  // output file
  output: {
    // path: the folder path of the output file
    path: path.resolve(__dirname, "dist"),
    // filename: the name of the output file
    filename: "bundle.js",
    publicPath: "/",
  },

  // target:
  // for server side app -> set target as "node",
  // for client side app -> set target as "web", which is the default
  target: "web",

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },

  resolve: {
    // extension: if multiple files share the same name but have different extensions, webpack will
    // esolve the one with the extension listed first in the array and skip the rest.
    extensions: [".js", ".jsx", ".json"],
  },

  plugins: [
    // serving the index.html file
    new HtmlWebpackPlugin({
      template: "./client/index.html",
      filename: "./index.html",
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],

  devServer: {
    // port: port of the dev server
    port: 8080,
    // static: this property tells webpack waht static file it should serve
    static: {
      directory: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    proxy: {
      "/": "http://localhost:3000",
      secure: false,
    },
    // open: this property opens the browser after the server is succesfully started
    open: true,
    // hot: enable hot module replacement without page refresh
    hot: true,
    // livereload: enable live reload on browswer
    liveReload: true,
    // allows for react router direct endpoint access
    historyApiFallback: true
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
