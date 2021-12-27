module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    camelcase: 'off',
    'vue/multi-word-component-names': ['error', {
      ignores: ['index', 'default']
    }]
  }
}
