export interface TokenParser {
  themeKey: string
  cssPrefix: string
  match: (variable: string) => boolean
  transformKey: (variable: string) => string
}
