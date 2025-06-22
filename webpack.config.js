const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // ✅ Tambahkan ini

module.exports = {
  entry: "./assets/components/app.js", // sudah benar
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./assets/components/index.html",
      filename: "index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: "." }, 
        { from: "public/sw.js", to: "sw.js" },
      ],
    }),
  ],
  devServer: {
    static: "./dist",
    open: true,
    hot: true,
    port: 3000,
  },
  mode: "development",
};
