import { defineConfig } from 'valaxy'
import type { ThemeConfig } from 'valaxy-theme-yun'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineConfig<ThemeConfig>({
  url: 'https://inprtx.eu.org',
  lang: 'zh-CN',
  title: 'InPRTx的小站',
  author: {
    name: 'InPRTx',
    avatar: 'https://secure.gravatar.com/avatar/42ea1e0b0fe40be889c7e57448be9520?s=150&r=G&d=robohash',
    status: {
      emoji: '👨‍💻',
    }
  },
  favicon: 'https://secure.gravatar.com/avatar/42ea1e0b0fe40be889c7e57448be9520?s=150&r=G&d=robohash',
  description: 'InPRTx的小站',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'Telegram',
      link: 'https://t.me/InPRTX',
      icon: 'i-ri-telegram-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/InPRTx',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/InPRTx',
      icon: 'i-ri-twitter-line',
      color: '#1da1f2',
    },
    {
      name: 'E-Mail',
      link: 'mailto:inprtx@gmail.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
    {
      name: 'Mastodon',
      link: 'https://m.cmx.im/@InPRTx',
      icon: 'i-ri-mastodon-line',
      color: '#8E71C1',
    },
    {
      name: 'DN42',
      link: 'https://23751.net',
      icon: 'i-ri-dn42-line'
    }
  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: false,
    title: '嘛！',
  },

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: 'InPRTx的小站',
    },

    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      }
    ],
    footer: {
      since: 2021,
      icon: {
        enable: false,
        name: 'i-ri-cloud-line',
        animated: true,
        color: 'var(--va-c-primary)',
        url: 'https://sponsors.yunyoujun.cn',
        title: 'Sponsor YunYouJun',
      }
    },
  },

  unocss: { safelist },

})
