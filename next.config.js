const runtimeCaching = require('next-pwa/cache')

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching,
  disable: process.env.NODE_ENV === 'development',
})

const linguiConfig = require('./lingui.config.js')

const { locales, sourceLocale } = linguiConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },
    ]

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        tls: false,
        net: false,
        fs: false,
      },
    }

    return config
  },
  experimental: { esmExternals: true },
  //   pwa: {
  //     dest: 'public',
  //     runtimeCaching,
  //     disable: process.env.NODE_ENV === 'development',
  //   },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'sideshift.ai',
      'i.seadn.io',
      'static-nft.pancakeswap.com',
      'cdn.nftkey.app',
      'd2q4k8i8tl5bvl.cloudfront.net',
      'api.dicebear.com',
    ],
  },
  reactStrictMode: false,
  async redirects() {
    return [
      // {
      //   source: '/',
      //   destination: '/home',
      //   permanent: true,
      // },

      {
        source: '/yield',
        destination: '/farm',
        permanent: true,
      },
      // Analytics
      //{
      //   source: '/analytics',
      //   destination: '/analytics/dashboard',
      //  permanent: true,
      // },
      {
        source: '/portfolio',
        destination: '/analytics/portfolio',
        permanent: true,
      },
      {
        source: '/bridge',
        destination: '/',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      // {
      //   source: '/stake',
      //   destination: '/bar',
      // },
      {
        source: '/vote',
        destination: '/governance',
      },
      {
        source: '/vote/:proposalId',
        destination: '/governance/proposal/:proposalId',
      },
      {
        source: '/add/:token*',
        destination: '/exchange/add/:token*',
      },
      {
        source: '/remove/:token*',
        destination: '/exchange/remove/:token*',
      },
      {
        source: '/create/:token*',
        destination: '/exchange/add/:token*',
      },
      {
        source: '/swap',
        destination: '/exchange/swap',
      },
      {
        source: '/swap/:token*',
        destination: '/exchange/swap/:token*',
      },
      {
        source: '/pool',
        destination: '/exchange/pool',
      },
      {
        source: '/find',
        destination: '/exchange/find',
      },
      // {
      //  source: '/lend',
      //  destination: '/mistlend/lend',
      // },
      //  {
      //    source: '/lend/:pair',
      //    destination: '/mistlend/lend/:pair',
      //  },
      //  {
      //   source: '/borrow',
      //  destination: '/mistlend/borrow',
      //},
      // {
      //   source: '/borrow/:pair',
      //   destination: '/mistlend/borrow/:pair',
      // },
      {
        source: '/create',
        destination: '/mistlend/create',
      },
      {
        source: '/balances',
        destination: '/user/balances',
      },
    ]
  },
  i18n: {
    localeDetection: true,
    locales,
    defaultLocale: sourceLocale,
  },
}

module.exports = withPWA(withBundleAnalyzer(nextConfig))

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
