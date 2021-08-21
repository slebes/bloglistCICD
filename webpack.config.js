const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const sass = require('sass')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const { mode } = argv
  const additionalPlugins = mode === 'production'
    ? []
    : [new webpack.HotModuleReplacementPlugin()] // Enable hot module replacement

  const additionalEntries = mode === 'production' ? [] : ['webpack-hot-middleware/client?http://localhost:3003']

  return {
    mode,
    entry: [
      '@babel/polyfill', // so we don't need to import it anywhere
      './client',
      ...additionalEntries,
    ],
    resolve: {
      alias: {
        Components: path.resolve(__dirname, 'client/components/'),
        Services: path.resolve(__dirname, 'client/services/'),
        Public: path.resolve(__dirname, 'client/public/'),
        '@root': path.resolve(__dirname),
      },
    },
    module: {
      rules: [
        {
          // Load JS files
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        { // Load SCSS & SASS files
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',

            // Compiles Sass to CSS
            {
              loader: 'sass-loader',
              options: {
                // Prefer `dart-sass`
                implementation: sass,
              },
            },
          ],
        },
        {
          // Load other files
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BUILT_AT': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      // Skip the part where we would make a html template
      new HtmlWebpackPlugin({
        template: 'index.html',
        favicon: path.resolve(__dirname, 'client/public/favicon.ico'),
      }),
      new MiniCssExtractPlugin(),
      ...additionalPlugins,
    ],
  }
}
