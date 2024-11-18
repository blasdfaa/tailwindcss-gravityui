import type { ThemeConfig } from 'tailwindcss/types/config'
import { objectEntries, setNestedValue } from './utils'

type ThemeConfigKey = keyof ThemeConfig

interface CreateThemeConfigOptions {
  variables: Record<string, string>
  mappings: Partial<Record<ThemeConfigKey, (key: string) => boolean>>
}

function getConfigKey(variable: string, category: ThemeConfigKey) {
  switch (category) {
    case 'colors': {
      const baseKey = variable
        .replace(/-solid$/, '')
        .replace('--g-color-', '')
        .replace(/-/g, '.')
        .replace('private.', '')

      if (variable.endsWith('-solid')) {
        return `${baseKey}.solid`
      }
      else {
        return `${baseKey}.DEFAULT`
      }
    }
    case 'fontSize':
      return variable
        .replace('--g-text-', '')
        .replace('-font-size', '')
    case 'borderRadius':
      return variable.replace('--g-border-radius-', '')
    default:
      return variable
  }
}

export function createThemeConfig({
  variables,
  mappings,
}: CreateThemeConfigOptions,
): Partial<ThemeConfig> {
  return Object.keys(variables).reduce((acc, variable) => {
    for (const [category, isMatch] of objectEntries(mappings)) {
      if (isMatch && isMatch(variable)) {
        if (!acc[category])
          acc[category] = {}

        const path = getConfigKey(variable, category)
        setNestedValue(acc[category], path, `var(${variable})`)
      }
    }

    return acc
  }, {} as Partial<ThemeConfig>)
}
