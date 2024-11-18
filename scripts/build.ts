import fs from 'node:fs'
import path from 'node:path'
import css from 'css'
import { createThemeConfig } from '../src/theme'

const url = 'https://unpkg.com/@gravity-ui/uikit@6.35.2/styles/styles.css'

async function main() {
  const response = await fetch(url)
  const cssText = await response.text()

  const parsedCss = css.parse(cssText)

  // Объект для хранения переменных
  const variables = {}

  // Проходимся по всем правилам в CSS
  parsedCss.stylesheet?.rules.forEach((rule) => {
    if (rule.type !== 'rule')
      return

    if (rule.selectors?.includes('.g-root') || rule.selectors?.includes('.g-root_theme_light')) {
      rule.declarations?.forEach((decl) => {
        if (decl.type === 'declaration' && decl.property?.startsWith('--')) {
          variables[decl.property] = decl.value
        }
      })
    }
  })

  const themeConfigContent = createThemeConfig({
    variables,
    mappings: {
      colors: key => key.startsWith('--g-color-'),
      fontSize: key => key.includes('font-size'),
      borderRadius: key => key.includes('border-radius'),
    },
  })

  fs.writeFileSync(
    path.join(import.meta.dirname, '..', 'theme-config.json'),
    JSON.stringify(themeConfigContent),
  )
}

main()
