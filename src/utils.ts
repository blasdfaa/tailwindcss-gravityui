export function objectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

export function setNestedValue(
  obj: Record<string, any>,
  path: string,
  value: unknown,
) {
  const keys = path.split('.')
  let current = obj

  keys.forEach((key, index) => {
    if (!current[key]) {
      current[key] = index === keys.length - 1 ? value : {}
    }

    current = current[key]
  })
}
