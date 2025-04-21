module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Add any babel plugins that might help suppress warnings
      ["@babel/plugin-transform-modules-commonjs", { strictMode: false }],
    ],
    comments: false, // Removes comments from the output
  };
};
