const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

rules.push(
  {
    test: /\.(scss|css)$/,
    use: ["style-loader", "css-loader", "sass-loader"],
  },
  {
    test: /\.module\.(scss|css)$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: true,
        },
      },
      "sass-loader",
    ],
  }
);

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
