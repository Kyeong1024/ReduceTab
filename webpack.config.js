const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");

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
    ],
  },
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
