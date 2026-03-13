export function objectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

export function dotPathToCssName(path: string): string {
  return path
    .replace(/\.DEFAULT$/, '')
    .replace(/\./g, '-')
}

export function setNestedValue(
  obj: Record<string, any>,
  path: string,
  value: unknown,
) {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!
    const isLast = i === keys.length - 1

    if (isLast) {
      current[key] = value
    }
    else {
      if (typeof current[key] !== 'object' || current[key] === null)
        current[key] = {}

      current = current[key]
    }
  }
}
