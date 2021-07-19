const path = require('path')

module.exports = {
  "stories": [
    "../**/*.stories.mdx",
    "../**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],

  webpackFinal: async (config) => {
    config.resolve.alias['~', '@'] = path.resolve(__dirname, '../')

    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', {
        loader: 'sass-loader',
        options: {
          prependData: `
            @import '~/assets/scss/main.scss';
          `
        }
      }
      ],
      include: path.resolve(__dirname, '../'),
    })

    return config
  },
}
