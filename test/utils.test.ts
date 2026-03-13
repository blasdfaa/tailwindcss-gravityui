import { describe, expect, it } from 'vitest'
import { dotPathToCssName, objectEntries, setNestedValue } from '../src/utils'

describe('objectEntries', () => {
  it('should return typed entries', () => {
    const obj = { a: 1, b: 'hello' }
    const entries = objectEntries(obj)

    expect(entries).toEqual([['a', 1], ['b', 'hello']])
  })

  it('should return empty array for empty object', () => {
    expect(objectEntries({})).toEqual([])
  })
})

describe('dotPathToCssName', () => {
  it('should strip .DEFAULT suffix and replace dots with dashes', () => {
    expect(dotPathToCssName('red.500.DEFAULT')).toBe('red-500')
  })

  it('should keep non-DEFAULT suffix', () => {
    expect(dotPathToCssName('red.500.solid')).toBe('red-500-solid')
  })

  it('should return simple keys as-is', () => {
    expect(dotPathToCssName('body-1')).toBe('body-1')
    expect(dotPathToCssName('m')).toBe('m')
  })

  it('should handle deeply nested DEFAULT paths', () => {
    expect(dotPathToCssName('base.brand.hover.DEFAULT')).toBe('base-brand-hover')
  })

  it('should handle semantic color paths', () => {
    expect(dotPathToCssName('text.primary.DEFAULT')).toBe('text-primary')
    expect(dotPathToCssName('line.generic.solid')).toBe('line-generic-solid')
  })
})

describe('setNestedValue', () => {
  it('should set a top-level key', () => {
    const obj: Record<string, any> = {}
    setNestedValue(obj, 'color', 'red')

    expect(obj).toEqual({ color: 'red' })
  })

  it('should set a nested key', () => {
    const obj: Record<string, any> = {}
    setNestedValue(obj, 'colors.red.500', '#f00')

    expect(obj).toEqual({ colors: { red: { 500: '#f00' } } })
  })

  it('should create intermediate objects', () => {
    const obj: Record<string, any> = {}
    setNestedValue(obj, 'a.b.c.d', 'value')

    expect(obj.a.b.c.d).toBe('value')
  })

  it('should add sibling keys without overwriting', () => {
    const obj: Record<string, any> = {}
    setNestedValue(obj, 'red.50.DEFAULT', 'var(--r-50)')
    setNestedValue(obj, 'red.50.solid', 'var(--r-50-solid)')

    expect(obj).toEqual({
      red: {
        50: {
          DEFAULT: 'var(--r-50)',
          solid: 'var(--r-50-solid)',
        },
      },
    })
  })

  it('should overwrite existing value at the same path', () => {
    const obj: Record<string, any> = {}
    setNestedValue(obj, 'a.b', 'old')
    setNestedValue(obj, 'a.b', 'new')

    expect(obj.a.b).toBe('new')
  })

  it('should replace primitive with object for intermediate keys', () => {
    const obj: Record<string, any> = { a: 'primitive' }
    setNestedValue(obj, 'a.b', 'value')

    expect(obj).toEqual({ a: { b: 'value' } })
  })

  it('should handle null intermediate values', () => {
    const obj: Record<string, any> = { a: null }
    setNestedValue(obj, 'a.b', 'value')

    expect(obj).toEqual({ a: { b: 'value' } })
  })
})
