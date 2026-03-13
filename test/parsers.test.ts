import { describe, expect, it } from 'vitest'
import { borderRadiusParser } from '../scripts/parsers/border-radius'
import { colorsParser } from '../scripts/parsers/colors'
import { fontSizeParser } from '../scripts/parsers/font-size'

describe('colorsParser', () => {
  describe('match', () => {
    it('should match color variables', () => {
      expect(colorsParser.match('--g-color-text-primary')).toBe(true)
      expect(colorsParser.match('--g-color-private-red-500')).toBe(true)
      expect(colorsParser.match('--g-color-base-background')).toBe(true)
      expect(colorsParser.match('--g-color-private-blue-50-solid')).toBe(true)
    })

    it('should not match non-color variables', () => {
      expect(colorsParser.match('--g-text-body-1-font-size')).toBe(false)
      expect(colorsParser.match('--g-border-radius-m')).toBe(false)
      expect(colorsParser.match('--some-other-var')).toBe(false)
    })
  })

  describe('transformKey', () => {
    it('should transform private color to nested DEFAULT key', () => {
      expect(colorsParser.transformKey('--g-color-private-red-500'))
        .toBe('red.500.DEFAULT')
    })

    it('should transform private solid color to nested solid key', () => {
      expect(colorsParser.transformKey('--g-color-private-red-500-solid'))
        .toBe('red.500.solid')
    })

    it('should transform semantic color to nested DEFAULT key', () => {
      expect(colorsParser.transformKey('--g-color-text-primary'))
        .toBe('text.primary.DEFAULT')
    })

    it('should transform base color with nested path', () => {
      expect(colorsParser.transformKey('--g-color-base-brand-hover'))
        .toBe('base.brand.hover.DEFAULT')
    })

    it('should transform line-generic-solid to solid key', () => {
      expect(colorsParser.transformKey('--g-color-line-generic-solid'))
        .toBe('line.generic.solid')
    })
  })
})

describe('fontSizeParser', () => {
  describe('match', () => {
    it('should match font-size variables', () => {
      expect(fontSizeParser.match('--g-text-body-1-font-size')).toBe(true)
      expect(fontSizeParser.match('--g-text-header-2-font-size')).toBe(true)
      expect(fontSizeParser.match('--g-text-code-inline-1-font-size')).toBe(true)
    })

    it('should not match line-height variables', () => {
      expect(fontSizeParser.match('--g-text-body-1-line-height')).toBe(false)
    })

    it('should not match non-text variables', () => {
      expect(fontSizeParser.match('--g-color-text-primary')).toBe(false)
      expect(fontSizeParser.match('--g-border-radius-m')).toBe(false)
    })
  })

  describe('transformKey', () => {
    it('should strip prefix and suffix', () => {
      expect(fontSizeParser.transformKey('--g-text-body-1-font-size'))
        .toBe('body-1')
    })

    it('should handle compound names', () => {
      expect(fontSizeParser.transformKey('--g-text-code-inline-1-font-size'))
        .toBe('code-inline-1')
    })

    it('should handle display sizes', () => {
      expect(fontSizeParser.transformKey('--g-text-display-3-font-size'))
        .toBe('display-3')
    })
  })
})

describe('borderRadiusParser', () => {
  describe('match', () => {
    it('should match border-radius variables', () => {
      expect(borderRadiusParser.match('--g-border-radius-xs')).toBe(true)
      expect(borderRadiusParser.match('--g-border-radius-m')).toBe(true)
      expect(borderRadiusParser.match('--g-border-radius-xl')).toBe(true)
    })

    it('should not match focus border radius', () => {
      expect(borderRadiusParser.match('--g-focus-border-radius')).toBe(false)
    })

    it('should not match non-radius variables', () => {
      expect(borderRadiusParser.match('--g-color-text-primary')).toBe(false)
    })
  })

  describe('transformKey', () => {
    it('should strip the prefix', () => {
      expect(borderRadiusParser.transformKey('--g-border-radius-xs')).toBe('xs')
      expect(borderRadiusParser.transformKey('--g-border-radius-m')).toBe('m')
      expect(borderRadiusParser.transformKey('--g-border-radius-xl')).toBe('xl')
    })
  })
})
