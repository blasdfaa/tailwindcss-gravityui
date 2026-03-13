import type { TokenParser } from './types'

export const colorsParser: TokenParser = {
  themeKey: 'colors',
  cssPrefix: '--color-',
  match: variable => variable.startsWith('--g-color-'),
  transformKey: (variable) => {
    const baseKey = variable
      .replace(/-solid$/, '')
      .replace('--g-color-', '')
      .replace(/-/g, '.')
      .replace('private.', '')

    return variable.endsWith('-solid') ? `${baseKey}.solid` : `${baseKey}.DEFAULT`
  },
}
