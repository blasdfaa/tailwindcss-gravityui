import type { TokenParser } from './parsers'
import { dotPathToCssName } from '../src/utils'

export function buildThemeCss(
  variables: Record<string, string>,
  parsers: TokenParser[],
): string {
  const lines: string[] = []

  for (const variable of Object.keys(variables)) {
    for (const parser of parsers) {
      if (parser.match(variable)) {
        const key = parser.transformKey(variable)
        const cssName = `${parser.cssPrefix}${dotPathToCssName(key)}`
        lines.push(`  ${cssName}: var(${variable});`)
        break
      }
    }
  }

  if (lines.length === 0)
    return ''

  return `@theme {\n${lines.join('\n')}\n}\n`
}
