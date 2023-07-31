// site.config.ts
import {defineSiteConfig} from 'valaxy'

export default defineSiteConfig({
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
  // subtitle: 'All at sea.',
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
      name: 'Misskey',
      link: 'https://m.moec.top/@InPRTx',
      icon: 'i-simple-icons-misskey',
      color: '#94ce20',
    },
    {
      name: 'E-Mail',
      link: 'mailto:inprtx@gmail.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
    {
      name: 'BGP',
      link: 'https://23751.net',
      icon: 'i-mdi-router'
    }
  ],
  search: {
    enable: true,
  },
  sponsor: {
    enable: false,
    title: '嘛！',
  },
})
