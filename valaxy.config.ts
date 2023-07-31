import {defineValaxyConfig} from 'valaxy'
import type {ThemeConfig} from 'valaxy-theme-yun'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<ThemeConfig>({
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
  unocss: {safelist},
})
