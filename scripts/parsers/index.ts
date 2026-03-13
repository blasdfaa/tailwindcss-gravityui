import type { TokenParser } from './types'
import { borderRadiusParser } from './border-radius'
import { colorsParser } from './colors'
import { fontSizeParser } from './font-size'

export type { TokenParser } from './types'

export const tokenParsers: TokenParser[] = [
  colorsParser,
  fontSizeParser,
  borderRadiusParser,
]
