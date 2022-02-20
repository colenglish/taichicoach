// https://www.toptal.com/react/webpack-react-tutorial-pt-1
// Needed to get JSX content working using babel
// webpack.config.js is the default, picked up automatically by webpack-cli (see package.json build script)

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function(_env, argv) {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  return {
    devtool: isDevelopment && "source-map",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "public/dist"),
        filename: "./app-bundle.js",
        publicPath: "/dist/"
    },
    module: {
        rules: [
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        envName: isProduction ? "production" : "development"
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    // TODO: plugins: [html bundle auto insert and css bundles for prod],
    watch: true,
    watchOptions: {
        aggregateTimeout: 600,
        ignored: /node_modules/,
        poll: 1000 // Check for changes every second
    }
  };
};