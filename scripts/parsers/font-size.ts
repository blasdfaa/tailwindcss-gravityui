import type { TokenParser } from './types'

export const fontSizeParser: TokenParser = {
  themeKey: 'fontSize',
  cssPrefix: '--font-size-',
  match: variable => variable.startsWith('--g-text-') && variable.endsWith('-font-size'),
  transformKey: variable => variable.replace('--g-text-', '').replace('-font-size', ''),
}
