import fs from 'node:fs'
import path from 'node:path'
import css from 'css'
import { buildThemeConfig } from './build-theme-config'
import { buildThemeCss } from './build-theme-css'
import { tokenParsers } from './parsers'

const CSS_URL = 'https://unpkg.com/@gravity-ui/uikit/styles/styles.css'

async function fetchCssText(url: string): Promise<string> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch CSS: ${response.status} ${response.statusText}`)
  }

  return response.text()
}

function writeThemeConfig(filePath: string, themeConfig: Record<string, unknown>): void {
  fs.writeFileSync(filePath, `${JSON.stringify(themeConfig, null, 2)}\n`)
}

function extractCssVariables(cssText: string): Record<string, string> {
  const parsedCss = css.parse(cssText)
  const variables: Record<string, string> = {}

  parsedCss.stylesheet?.rules.forEach((rule) => {
    if (rule.type !== 'rule')
      return
    if (!rule.selectors?.includes('.g-root') && !rule.selectors?.includes('.g-root_theme_light'))
      return

    rule.declarations?.forEach((decl) => {
      if (decl.type === 'declaration' && decl.property?.startsWith('--') && decl.value) {
        variables[decl.property] = decl.value
      }
    })
  })

  return variables
}

async function main() {
  const cssText = await fetchCssText(CSS_URL)
  const variables = extractCssVariables(cssText)
  const rootDir = path.join(import.meta.dirname, '..')

  const themeConfig = buildThemeConfig(variables, tokenParsers)
  writeThemeConfig(path.join(rootDir, 'theme-config.json'), themeConfig)

  const themeCss = buildThemeCss(variables, tokenParsers)
  fs.writeFileSync(path.join(rootDir, 'theme.css'), themeCss)
}

main()
