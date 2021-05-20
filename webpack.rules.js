module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.(js|jsx|ts|tsx)?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/react", "@babel/typescript"],
        plugins: [["@babel/plugin-proposal-class-properties", { loose: true }], "styled-jsx/babel"],
      },
    },
  },
];
