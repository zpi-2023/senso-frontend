module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required for expo-router
      "expo-router/babel",
      // Optional - rewrites import statements to make sure that we import only the modules that we need
      "react-native-paper/babel",
      // Replace process.env.X with the value of the environment variable X
      "transform-inline-environment-variables",
    ],
  };
};
