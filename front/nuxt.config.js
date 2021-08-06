import axios from 'axios'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'TOP',
    titleTemplate: '%s | 上場企業ランキング',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/file-bar-graph.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    'plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/google-analytics'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/sitemap'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  // https://github.com/bootstrap-vue/bootstrap-vue/issues/5627#issuecomment-668487772
    babel: {
      compact: true
    }
  },

  generate: {
    routes () {
      const companies = axios.get(`${process.env.API_URL}/api/v1/company_ids`)
        .then(({ data }) => {
          return data.company_ids.map((id) => {
            return `/companies/${id}`
          })
        })

      const industries = axios.get(`${process.env.API_URL}/api/v1/industry_ids`)
        .then(({ data }) => {
          return data.industry_ids.map((id) => {
            return `/industries/${id}`
          })
        })

      const markets = axios.get(`${process.env.API_URL}/api/v1/market_ids`)
        .then(({ data }) => {
          return data.market_ids.map((id) => {
            return `/markets/${id}`
          })
        })

      return Promise.all([companies, industries, markets]).then((values) => {
        return values.join().split(',')
      })
    }
  },

  bootstrapVue: {
    componentPlugins: [
      'NavbarPlugin'
    ],
    components: [
      'BIconBarChart',
      'BIconBuilding',
      'BIconGraphUp',
      'BIconTwitter'
    ]
  },

  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID // Use as fallback if no runtime config is provided
  },

  publicRuntimeConfig: {
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    }
  },

  sitemap: {
    hostname: 'https://company-ranking.net',
    gzip: true
  }
}
