import type { TokenParser } from '../scripts/parsers'
import { describe, expect, it } from 'vitest'
import { buildThemeCss } from '../scripts/build-theme-css'
import { tokenParsers } from '../scripts/parsers'

describe('buildThemeCss', () => {
  it('should return empty string when no variables provided', () => {
    expect(buildThemeCss({}, tokenParsers)).toBe('')
  })

  it('should return empty string when no variables match any parser', () => {
    const variables = {
      '--unknown-var': '#fff',
      '--another-one': '10px',
    }
    expect(buildThemeCss(variables, tokenParsers)).toBe('')
  })

  it('should generate @theme block with correct CSS variables', () => {
    const variables = {
      '--g-text-body-1-font-size': '13px',
      '--g-border-radius-m': '8px',
    }
    const result = buildThemeCss(variables, tokenParsers)

    expect(result).toBe(
      `@theme {\n`
      + `  --font-size-body-1: var(--g-text-body-1-font-size);\n`
      + `  --radius-m: var(--g-border-radius-m);\n`
      + `}\n`,
    )
  })

  it('should map color DEFAULT and solid variants correctly', () => {
    const variables = {
      '--g-color-private-red-500': 'rgba(255, 0, 0, 0.5)',
      '--g-color-private-red-500-solid': '#ff0000',
    }
    const result = buildThemeCss(variables, tokenParsers)

    expect(result).toContain('--color-red-500: var(--g-color-private-red-500);')
    expect(result).toContain('--color-red-500-solid: var(--g-color-private-red-500-solid);')
  })

  it('should map semantic colors correctly', () => {
    const variables = {
      '--g-color-text-primary': '#000',
      '--g-color-base-brand-hover': '#00f',
    }
    const result = buildThemeCss(variables, tokenParsers)

    expect(result).toContain('--color-text-primary: var(--g-color-text-primary);')
    expect(result).toContain('--color-base-brand-hover: var(--g-color-base-brand-hover);')
  })

  it('should stop at first matching parser', () => {
    const duplicateParser: TokenParser = {
      themeKey: 'duplicateColors',
      cssPrefix: '--dup-color-',
      match: variable => variable.startsWith('--g-color-'),
      transformKey: variable => variable,
    }
    const variables = { '--g-color-text-primary': '#000' }
    const result = buildThemeCss(variables, [...tokenParsers, duplicateParser])

    expect(result).toContain('--color-text-primary:')
    expect(result).not.toContain('--dup-color-')
  })

  it('should work with custom parsers', () => {
    const lineHeightParser: TokenParser = {
      themeKey: 'lineHeight',
      cssPrefix: '--line-height-',
      match: variable => variable.startsWith('--g-text-') && variable.endsWith('-line-height'),
      transformKey: variable => variable.replace('--g-text-', '').replace('-line-height', ''),
    }

    const variables = {
      '--g-text-body-1-line-height': '18px',
    }
    const result = buildThemeCss(variables, [lineHeightParser])

    expect(result).toBe(
      `@theme {\n`
      + `  --line-height-body-1: var(--g-text-body-1-line-height);\n`
      + `}\n`,
    )
  })

  it('should generate all three sections together', () => {
    const variables = {
      '--g-color-private-blue-50': 'rgba(0, 0, 255, 0.1)',
      '--g-text-header-1-font-size': '20px',
      '--g-border-radius-xl': '20px',
    }
    const result = buildThemeCss(variables, tokenParsers)

    expect(result).toContain('--color-blue-50: var(--g-color-private-blue-50);')
    expect(result).toContain('--font-size-header-1: var(--g-text-header-1-font-size);')
    expect(result).toContain('--radius-xl: var(--g-border-radius-xl);')
    expect(result).toMatch(/^@theme \{/)
    expect(result).toMatch(/\}\n$/)
  })
})
