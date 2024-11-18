import plugin from 'tailwindcss/plugin'
import themeConfig from '../theme-config.json'

export default plugin(() => {}, {
  theme: {
    extend: themeConfig,
  },
})
