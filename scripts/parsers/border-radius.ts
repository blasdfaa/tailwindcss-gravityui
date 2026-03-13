import type { TokenParser } from './types'

export const borderRadiusParser: TokenParser = {
  themeKey: 'borderRadius',
  cssPrefix: '--radius-',
  match: variable => variable.startsWith('--g-border-radius-'),
  transformKey: variable => variable.replace('--g-border-radius-', ''),
}
