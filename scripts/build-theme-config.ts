import type { TokenParser } from './parsers'
import { setNestedValue } from '../src/utils'

export function buildThemeConfig(
  variables: Record<string, string>,
  parsers: TokenParser[],
): Record<string, unknown> {
  const config: Record<string, Record<string, unknown>> = {}

  for (const variable of Object.keys(variables)) {
    for (const parser of parsers) {
      if (parser.match(variable)) {
        if (!config[parser.themeKey])
          config[parser.themeKey] = {}

        const key = parser.transformKey(variable)
        setNestedValue(config[parser.themeKey], key, `var(${variable})`)
        break
      }
    }
  }

  return config
}
