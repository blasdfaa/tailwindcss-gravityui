import type { TokenParser } from '../scripts/parsers'
import { describe, expect, it } from 'vitest'
import { buildThemeConfig } from '../scripts/build-theme-config'
import { tokenParsers } from '../scripts/parsers'

describe('buildThemeConfig', () => {
  it('should return empty object when no variables provided', () => {
    expect(buildThemeConfig({}, tokenParsers)).toEqual({})
  })

  it('should return empty object when no variables match any parser', () => {
    const variables = {
      '--unknown-var': '#fff',
      '--another-one': '10px',
    }
    expect(buildThemeConfig(variables, tokenParsers)).toEqual({})
  })

  it('should group variables into correct theme sections', () => {
    const variables = {
      '--g-color-text-primary': '#000',
      '--g-text-body-1-font-size': '13px',
      '--g-border-radius-m': '8px',
    }
    const result = buildThemeConfig(variables, tokenParsers)

    expect(result).toHaveProperty('colors')
    expect(result).toHaveProperty('fontSize')
    expect(result).toHaveProperty('borderRadius')
  })

  it('should stop at first matching parser (no duplicate entries)', () => {
    const duplicateParser: TokenParser = {
      themeKey: 'duplicateColors',
      cssPrefix: '--color-',
      match: variable => variable.startsWith('--g-color-'),
      transformKey: variable => variable,
    }
    const variables = { '--g-color-text-primary': '#000' }
    const result = buildThemeConfig(variables, [...tokenParsers, duplicateParser])

    expect(result).not.toHaveProperty('duplicateColors')
    expect(result).toHaveProperty('colors')
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
    const result = buildThemeConfig(variables, [lineHeightParser])

    expect(result).toEqual({
      lineHeight: {
        'body-1': 'var(--g-text-body-1-line-height)',
      },
    })
  })

  describe('colors parser', () => {
    it('should correctly map color variables', () => {
      const variables = {
        '--g-color-private-red-500': 'rgba(255, 0, 0, 0.5)',
        '--g-color-private-red-500-solid': '#ff0000',
      }
      const result = buildThemeConfig(variables, tokenParsers)

      expect(result).toEqual({
        colors: {
          red: {
            500: {
              DEFAULT: 'var(--g-color-private-red-500)',
              solid: 'var(--g-color-private-red-500-solid)',
            },
          },
        },
      })
    })
  })

  describe('fontSize parser', () => {
    it('should correctly map font-size variables', () => {
      const variables = {
        '--g-text-body-1-font-size': '13px',
        '--g-text-header-2-font-size': '24px',
      }
      const result = buildThemeConfig(variables, tokenParsers)

      expect(result).toEqual({
        fontSize: {
          'body-1': 'var(--g-text-body-1-font-size)',
          'header-2': 'var(--g-text-header-2-font-size)',
        },
      })
    })
  })

  describe('borderRadius parser', () => {
    it('should correctly map border-radius variables', () => {
      const variables = {
        '--g-border-radius-s': '5px',
        '--g-border-radius-xl': '20px',
      }
      const result = buildThemeConfig(variables, tokenParsers)

      expect(result).toEqual({
        borderRadius: {
          s: 'var(--g-border-radius-s)',
          xl: 'var(--g-border-radius-xl)',
        },
      })
    })

    it('should skip non-border-radius variables like --g-focus-border-radius', () => {
      const variables = {
        '--g-focus-border-radius': '2px',
        '--g-border-radius-m': '8px',
      }
      const result = buildThemeConfig(variables, tokenParsers)

      expect(result).toEqual({
        borderRadius: {
          m: 'var(--g-border-radius-m)',
        },
      })
    })
  })
})
