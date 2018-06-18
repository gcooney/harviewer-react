const webpack = require("webpack");
const path = require("path");
const packageJson = require("./package.json");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// Export some data to the webpack build.  See buildInfo.js.
const gitRevisionPlugin = new GitRevisionPlugin();
const definePlugin = new webpack.DefinePlugin({
  __buildInfo__: {
    version: JSON.stringify(packageJson.version),
    gitVersion: JSON.stringify(gitRevisionPlugin.version()),
    gitCommit: JSON.stringify(gitRevisionPlugin.commithash())
  },
});

module.exports = {
  mode: "development",
  //context: path.join(__dirname, "webapp"),
  entry: {
    // polyfill required by (at least) IE11
    main: [
      "babel-polyfill",
      "whatwg-fetch",
      "./webapp/main.js",
    ],
    demo: [
      "babel-polyfill",
      "whatwg-fetch",
      "./webapp/demo.js",
    ],
  },
  output: {
    filename: "./webapp/[name].entry.js",
  },
  devtool: "source-map",
  plugins: [
    definePlugin,
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },
  module: {
    rules: [
      {
        // .js or .jsx
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["env", {
                useBuiltIns: true,
                targets: {
                  "ie": "11",
                },
                debug: true,
              }],
              "react",
            ],
            // transform-runtime required for things like Object.assign() for browsers that don't support that.
            // rest-spread transform required for "valuelink"" module
            plugins: [
              "transform-object-assign",
              "transform-object-rest-spread",
              "transform-class-properties",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        // inline base64 URLs for <=8k images, direct URLs for the rest
        test: /\.(png|jpg)$/,
        loader: "url-loader?limit=8192",
      },
    ],
  },
  devServer: {
    // Until all the test resources are part of the harviewer-react project,
    // use the original harviewer resources via proxy.
    proxy: {
      "/selenium": "http://harviewer.lan:49001",
    },
  },
};
