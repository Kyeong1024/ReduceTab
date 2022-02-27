const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: path.resolve("src/popup/popup.js"),
  },
  module: {},
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/manifest.json"),
          to: path.resolve("dist"),
        },
      ],
    }),
    new HtmlPlugin({
      filename: "popup.html",
      chunks: ["popup"],
    }),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve("dist"),
  },
};
