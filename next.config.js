const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        {
          // for HMR support.
          loader:
            !isServer && dev ? 'style-loader' : MiniCssExtractPlugin.loader,
        },
        { loader: 'css-loader' },
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          },
        },
      ],
    })

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].css',
      })
    )

    return config
  },
}
