const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: "./src/popup/popup.js",
    background: "./src/background.js",
    main: "./src/main/main.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        type: "asset/resource",
        test: /\.(jpg|jpeg|png|svg|ttf)$/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/static/manifest.json"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve("src/static/icon.png"),
          to: path.resolve("dist"),
        },
      ],
    }),
    new HtmlPlugin({
      filename: "./popup.html",
      template: "./src/popup/popup.html",
      chunks: ["popup"],
    }),
    new HtmlPlugin({
      filename: "./main.html",
      template: "./src/main/main.html",
      chunks: ["main"],
    }),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
